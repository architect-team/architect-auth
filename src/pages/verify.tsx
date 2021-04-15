import { Context } from '@nuxt/types';
import { Configuration, PublicApi, VerificationFlow } from '@oryd/kratos-client';
import { Vue, Component } from 'nuxt-property-decorator';
import FormWrapper from '~/components/form-wrapper';
import KratosForm from '~/components/kratos-form';

@Component
export default class VerifyPage extends Vue {
  flow!: VerificationFlow;
  return_to!: string;

  async asyncData({ query, req, redirect, error }: Context) {
    // If we have a return_to address, store it and initiate login flow
    if (query.return_to) {
      req.session.return_to = query.return_to;
      return redirect(`/self-service/verification/browser?return_to=${req.session.return_to}`);
    }

    // If we don't have a return_to or flow parameter, something is wrong
    if (!query.flow) {
      return error({
        statusCode: 400,
        message: 'Login flow not initialized',
      });
    }

    const kratos_client = new PublicApi(
      new Configuration({
        basePath: process.env.KRATOS_PUBLIC_URL,
      })
    );

    try {
      const res = await kratos_client.getSelfServiceVerificationFlow(String(query.flow));
      return {
        flow: res.data,
        return_to: req.session.return_to,
      };
    } catch (err) {
      return error({
        statusCode: 500,
        message: 'Invalid verification flow ID',
      });
    }
  }

  render() {
    if (this.flow.state === 'passed_challenge') {
      return (
        <FormWrapper
          title="Verification successful"
          subtitle={`Thanks for verifying your email address. Click the button below to continue on to ${process.env.NEXT_PUBLIC_APP_NAME}.`}
        >
          <v-btn color="primary" variant="contained" block depressed href={this.return_to}>
            Continue to {process.env.NEXT_PUBLIC_APP_NAME}
          </v-btn>
        </FormWrapper>
      );
    } else {
      return (
        <FormWrapper
          title="Email verification"
          subtitle="A verification email has been sent to the address specified during signup. If you need to resend this verification, type in your email below:"
        >
          {(this.flow.messages || []).map((message) => (
            <v-alert severity={message.type} text class="mb-4">
              {message.text}
            </v-alert>
          ))}

          {Object.values(this.flow.methods || {}).map((method, index) => (
            <KratosForm config={method.config} method={method.method} />
          ))}
        </FormWrapper>
      );
    }
  }
}

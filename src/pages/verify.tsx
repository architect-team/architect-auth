import { Context } from '@nuxt/types';
import { Configuration, PublicApi, VerificationFlow } from '@ory/kratos-client';
import { Component, Vue } from 'nuxt-property-decorator';
import FormWrapper from '~/components/form-wrapper';
import KratosUi from '~/components/kratos/ui';

@Component
export default class VerifyPage extends Vue {
  flow!: VerificationFlow;

  async asyncData({ query, req, redirect, error }: Context) {
    // If we don't have a flow parameter, something is wrong
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
      // This will only be hit if verification was already completed and the user resends the verification via the flow beflow
      return (
        <FormWrapper
          title="Verification successful"
          subtitle={`Thanks for verifying your email address.`}
        >
        </FormWrapper>
      );
    } else {
      return (
        <FormWrapper
          title="Email verification"
          subtitle="A verification email has been sent to the address specified during signup. If you need to resend this verification, type in your email below:"
        >
          <KratosUi ui={this.flow.ui} />
        </FormWrapper>
      );
    }
  }
}

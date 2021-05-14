import { Context } from '@nuxt/types';
import { Configuration, PublicApi, RegistrationFlow } from '@ory/kratos-client';
import { Component, Vue } from 'nuxt-property-decorator';
import FormWrapper from '~/components/form-wrapper';
import KratosUi from '~/components/kratos/ui';

@Component
export default class SignupPage extends Vue {
  flow!: RegistrationFlow;
  return_to!: string;

  async asyncData({ query, req, redirect, error }: Context) {
    // If we have a return_to address, store it and initiate login flow
    if (query.return_to) {
      req.session.return_to = query.return_to;
      return redirect(`/self-service/registration/browser?return_to=${req.session.return_to}`);
    }

    // If we don't have a return_to or flow parameter, something is wrong
    if (!query.flow) {
      return error({
        statusCode: 400,
        message: 'Signup flow not initialized',
      });
    }

    const kratos_client = new PublicApi(
      new Configuration({
        basePath: process.env.KRATOS_PUBLIC_URL,
      })
    );

    try {
      const res = await kratos_client.getSelfServiceRegistrationFlow(String(query.flow));
      return {
        flow: res.data,
        return_to: req.session.return_to,
      };
    } catch (err) {
      return error({
        statusCode: 500,
        message: 'Invalid signup flow ID',
      });
    }
  }

  render() {
    return (
      <FormWrapper
        title="Welcome"
        subtitle={`Sign up below to continue to ${process.env.NUXT_ENV_APP_NAME}`}
      >
        <KratosUi ui={this.flow.ui} />

        <v-divider class="mt-4" />

        <v-row class="mt-0">
          <v-col>
            <a href={`/self-service/login/browser?return_to=${encodeURIComponent(this.return_to)}`}>
              Already have an account? Log in.
            </a>
          </v-col>
        </v-row>
      </FormWrapper>
    );
  }
}

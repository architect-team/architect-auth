import { Context } from '@nuxt/types';
import { Configuration, LoginFlow, PublicApi } from '@oryd/kratos-client';
import { Component, Vue } from 'nuxt-property-decorator';
import FormWrapper from '~/components/form-wrapper';
import KratosForm from '~/components/kratos-form';

@Component
export default class LoginPage extends Vue {
  flow!: LoginFlow;

  async asyncData({ query, error }: Context) {
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
      const res = await kratos_client.getSelfServiceLoginFlow(
        String(query.flow)
      );
      return { flow: res.data };
    } catch (err) {
      return error({
        statusCode: 500,
        message: 'Invalid login flow ID',
      });
    }
  }

  render() {
    const sorted_methods = [];
    const { password, oidc, ...methods } = this.flow.methods;
    if (password) {
      sorted_methods.push(password);
    }

    if (oidc) {
      sorted_methods.push(oidc);
    }

    sorted_methods.push(...Object.values(methods));

    return (
      <FormWrapper
        title="Welcome back"
        subtitle={`Log in below to continue to ${process.env.APP_NAME}`}
      >
        {(this.flow.messages || []).map((message, index) => (
          <v-alert key={index} type={message.type} class="my-2">{message.text}</v-alert>
        ))}

        {sorted_methods.map((method, index) => <KratosForm config={method.config} method={method.method} divider={index + 1 < sorted_methods.length} />)}

        <v-row class="mt-0">
          <v-col>
            <a href="/recovery">Forgot password?</a>
          </v-col>
          <v-col>
            <a href="/self-service/registration/browser">
              Don't have an account? Sign up.
            </a>
          </v-col>
        </v-row>
      </FormWrapper>
    );
  }
}

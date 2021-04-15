import { Context } from '@nuxt/types';
import { Configuration, LoginFlow, PublicApi } from '@oryd/kratos-client';
import { Component, Vue } from 'nuxt-property-decorator';
import FormWrapper from '~/components/form-wrapper';
import KratosForm from '~/components/kratos-form';

@Component
export default class LoginPage extends Vue {
  flow!: LoginFlow;
  return_to!: string;

  async asyncData({ query, req, redirect, error }: Context) {
    // If we have a return_to address, store it and initiate login flow
    if (query.return_to) {
      req.session.return_to = query.return_to;
      return redirect(`/self-service/login/browser?return_to=${req.session.return_to}`);
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
      const res = await kratos_client.getSelfServiceLoginFlow(String(query.flow));
      return {
        flow: res.data,
        return_to: req.session.return_to,
      };
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
        subtitle={`Log in below to continue to ${process.env.NUXT_ENV_APP_NAME}`}
      >
        {(this.flow.messages || []).map((message, index) => (
          <v-alert key={index} type={message.type} text class="mb-4">
            {message.text}
          </v-alert>
        ))}

        {sorted_methods.map((method, index) => (
          <KratosForm
            config={method.config}
            method={method.method}
            divider={index + 1 < sorted_methods.length}
          />
        ))}

        <v-row class="mt-0">
          <v-col>
            <a
              href={`/self-service/recovery/browser?return_to=${encodeURIComponent(
                this.return_to
              )}`}
            >
              Forgot password?
            </a>
          </v-col>
          <v-col>
            <a
              href={`/self-service/registration/browser?return_to=${encodeURIComponent(
                this.return_to
              )}`}
            >
              Don't have an account? Sign up.
            </a>
          </v-col>
        </v-row>
      </FormWrapper>
    );
  }
}

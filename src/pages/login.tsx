import { Context } from '@nuxt/types';
import { Configuration, LoginFlow, PublicApi, UiNodeInputAttributes } from '@ory/kratos-client';
import { Component, Vue } from 'nuxt-property-decorator';
import FormWrapper from '~/components/form-wrapper';
import KratosMessage from '~/components/kratos/message';
import KratosUiNode from '~/components/kratos/ui-node';

@Component
export default class LoginPage extends Vue {
  flow!: LoginFlow;

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
      const res = await kratos_client.getSelfServiceLoginFlow(String(query.flow));
      return {
        flow: res.data,
      };
    } catch (err) {
      return error({
        statusCode: 500,
        message: 'Invalid login flow ID',
      });
    }
  }

  render() {
    const common_nodes = this.flow.ui.nodes.filter((node) => node.group === 'default');
    const password_nodes = this.flow.ui.nodes.filter((node) => node.group === 'password');
    const oidc_nodes = this.flow.ui.nodes.filter((node) => node.group === 'oidc');

    const request_url = new URL(this.flow.request_url);
    const return_to = request_url.searchParams.get('return_to') as string;

    return (
      <div>
        <FormWrapper
          title="Welcome back"
          subtitle={`Log in below to continue to ${process.env.NUXT_ENV_APP_NAME}`}
        >
          {this.flow.ui.messages?.map((message) => (
            <KratosMessage message={message} />
          ))}

          <form action={this.flow.ui.action} method={this.flow.ui.method}>
            {common_nodes.concat(password_nodes).map((node) => (
              <KratosUiNode node={node} />
            ))}
          </form>

          {oidc_nodes.length > 0 && <v-divider class="my-4" />}

          {oidc_nodes.length > 0 && (
            <form action={this.flow.ui.action} method={this.flow.ui.method}>
              {common_nodes.concat(oidc_nodes).map((node) => {
                const attributes = node.attributes as UiNodeInputAttributes;
                if (attributes.type === 'submit') {
                  return (
                    <v-btn
                      block
                      depressed
                      name={attributes.name}
                      type={attributes.type}
                      value={attributes.value}
                      disabled={attributes.disabled}
                    >
                      <v-icon left>mdi-github</v-icon>
                      {node.meta.label?.text}
                    </v-btn>
                  );
                }

                return <KratosUiNode node={node} />;
              })}
            </form>
          )}
        </FormWrapper>

        <v-row class="ma-0">
          <v-col sm="6" cols="12">
            <a href={`/self-service/recovery/browser?return_to=${encodeURIComponent(return_to)}`}>
              Forgot password?
            </a>
          </v-col>
          <v-col sm="6" cols="12" class="text-right">
            <a
              href={`/self-service/registration/browser?return_to=${encodeURIComponent(return_to)}`}
            >
              Don't have an account? Sign up.
            </a>
          </v-col>
        </v-row>
      </div>
    );
  }
}

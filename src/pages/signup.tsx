import { Context } from '@nuxt/types';
import {
  Configuration,
  PublicApi,
  RegistrationFlow,
  UiNodeInputAttributes
} from '@ory/kratos-client';
import { Component, Vue } from 'nuxt-property-decorator';
import FormWrapper from '~/components/form-wrapper';
import KratosMessage from '~/components/kratos/message';
import KratosUiNode from '~/components/kratos/ui-node';

@Component
export default class SignupPage extends Vue {
  flow!: RegistrationFlow;

  async asyncData({ query, req, redirect, error }: Context) {
    // If we don't have a flow parameter, something is wrong
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
      };
    } catch (err) {
      return error({
        statusCode: 500,
        message: 'Invalid signup flow ID',
      });
    }
  }

  render() {
    const common_nodes = this.flow.ui.nodes.filter((node) => node.group === 'default');
    const password_nodes = this.flow.ui.nodes.filter((node) => node.group === 'password');
    const oidc_nodes = this.flow.ui.nodes.filter((node) => node.group === 'oidc');

    let messages = this.flow.ui.messages || [];
    this.flow.ui.nodes.forEach((node) => {
      messages = messages.concat(node.messages || []);
    });

    const request_url = new URL(this.flow.request_url);
    const return_to = request_url.searchParams.get('return_to') as string;

    return (
      <div>
        <FormWrapper
          title="Welcome"
          subtitle={`Sign up below to continue to ${this.$config.app_name}`}
        >
          {messages?.map((message) => (
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
          <v-col class="text-center">
            <a href={`/self-service/login/browser?return_to=${encodeURIComponent(return_to)}`}>
              Already have an account? Log in.
            </a>
          </v-col>
        </v-row>
      </div>
    );
  }
}

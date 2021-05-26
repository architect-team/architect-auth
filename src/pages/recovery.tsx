import { Context } from '@nuxt/types';
import { Configuration, PublicApi, RecoveryFlow } from '@ory/kratos-client';
import { Component } from 'vue-property-decorator';
import FormWrapper from '~/components/form-wrapper';
import KratosUi from '~/components/kratos/ui';
import { VueComponent } from '~/vue-component';

@Component
export default class RecoverPage extends VueComponent<any> {
  flow!: RecoveryFlow;

  async asyncData({ query, req, redirect, error }: Context) {
    // If we don't have a flow parameter, something is wrong
    if (!query.flow) {
      return error({
        statusCode: 400,
        message: 'Recovery flow not initialized',
      });
    }

    const kratos_client = new PublicApi(
      new Configuration({
        basePath: process.env.KRATOS_PUBLIC_URL,
      })
    );

    try {
      const res = await kratos_client.getSelfServiceRecoveryFlow(String(query.flow));
      return {
        flow: res.data,
      };
    } catch (err) {
      return error({
        statusCode: 500,
        message: 'Invalid recovery flow ID',
      });
    }
  }

  render() {
    const request_url = new URL(this.flow.request_url);
    const return_to = request_url.searchParams.get('return_to') as string;

    return (
      <div>
        <FormWrapper
          title="Forgot your password?"
          subtitle="Enter your email address and we will send you instructions to reset your password"
        >
          <KratosUi ui={this.flow.ui} />
        </FormWrapper>

        <div class="text-center mt-4">
          <a href={`/self-service/login/browser?return_to=${encodeURIComponent(return_to)}`}>
            Back to login
          </a>
        </div>
      </div>
    );
  }
}

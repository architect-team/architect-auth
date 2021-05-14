import { Context } from '@nuxt/types';
import { Configuration, PublicApi, RecoveryFlow } from '@ory/kratos-client';
import { Component } from 'vue-property-decorator';
import FormWrapper from '~/components/form-wrapper';
import KratosUi from '~/components/kratos/ui';
import { VueComponent } from '~/vue-component';

@Component
export default class RecoverPage extends VueComponent<any> {
  flow!: RecoveryFlow;
  return_to!: string;

  async asyncData({ query, req, redirect, error }: Context) {
    // If we have a return_to address, store it and initiate login flow
    if (query.return_to) {
      req.session.return_to = query.return_to;
      return redirect(`/self-service/recovery/browser?return_to=${req.session.return_to}`);
    }

    // If we don't have a return_to or flow parameter, something is wrong
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
        return_to: req.session.return_to,
      };
    } catch (err) {
      return error({
        statusCode: 500,
        message: 'Invalid recovery flow ID',
      });
    }
  }

  render() {
    return (
      <FormWrapper
        title="Forgot your password?"
        subtitle="Enter your email address and we will send you instructions to reset your password"
      >
        <KratosUi ui={this.flow.ui} />

        <v-divider class="mt-4" />

        <div class="text-center mt-4">
          <a href={`/self-service/login/browser?return_to=${encodeURIComponent(this.return_to)}`}>
            Back to login
          </a>
        </div>
      </FormWrapper>
    );
  }
}

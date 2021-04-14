import { Component, Vue } from 'nuxt-property-decorator';
import { Context } from '@nuxt/types';
import { Configuration, LoginFlow, PublicApi } from '@oryd/kratos-client';
import FormWrapper from '../components/form-wrapper';

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
    return (
      <FormWrapper
        title="Welcome back"
        subtitle={`Log in below to continue to ${process.env.APP_NAME}`}
      ></FormWrapper>
    );
  }
}

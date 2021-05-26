import { Context } from '@nuxt/types';
import { Configuration, PublicApi } from '@ory/kratos-client';
import { Component, Vue } from 'nuxt-property-decorator';

@Component
export default class ErrorPage extends Vue {
  async asyncData({ query, error }: Context) {
    if (!query.error) {
      return error({
        statusCode: 404,
      });
    }

    const kratos_client = new PublicApi(
      new Configuration({
        basePath: process.env.KRATOS_PUBLIC_URL,
      })
    );
    const res = await kratos_client.getSelfServiceError(String(query.error));
    const first = (res.data.errors as any)[0];
    return error({
      statusCode: first.code,
      message: first.message,
    });
  }
}

import { Context } from '@nuxt/types';
import { Vue, Component } from 'nuxt-property-decorator';

@Component
export default class LogoutPage extends Vue {
  async asyncData({ query, redirect, error }: Context) {
    if (!query.return_to) {
      return error({
        statusCode: 400,
        message: 'No return_to value provided in the query params',
      });
    }

    return redirect(`/self-service/browser/flows/logout?return_to=${query.return_to}`);
  }
}

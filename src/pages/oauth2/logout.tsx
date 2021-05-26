import { Context } from '@nuxt/types';
import { AdminApi as HydraAdminApi, Configuration as HydraConfiguration } from '@oryd/hydra-client';
import { Component, Vue } from 'nuxt-property-decorator';

@Component
export default class LogoutPage extends Vue {
  async asyncData(ctx: Context) {
    const { query, redirect, error } = ctx;

    if (!query.logout_challenge) {
      return error({
        statusCode: 404,
      });
    }

    const hydra_admin_client = new HydraAdminApi(
      new HydraConfiguration({
        basePath: process.env.HYDRA_ADMIN_URL,
      })
    );

    try {
      await hydra_admin_client.getLogoutRequest(String(query.logout_challenge));
      const { data: accepted_request } = await hydra_admin_client.acceptLogoutRequest(
        String(query.logout_challenge)
      );
      return redirect(accepted_request.redirect_to);
    } catch (err) {
      if (err?.response?.data) {
        return error({
          statusCode: err.response.data.error.code,
          message: err.response.data.error.message,
        });
      } else {
        return error({
          statusCode: 500,
          message: 'An unknown error occurred',
        });
      }
    }
  }
}

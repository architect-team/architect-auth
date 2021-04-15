import crypto from 'crypto';
import { Context } from '@nuxt/types';
import { AdminApi as HydraAdminApi, Configuration as HydraConfiguration } from '@oryd/hydra-client';
import { Vue, Component } from 'nuxt-property-decorator';
import {
  Configuration as KratosConfiguration,
  PublicApi as KratosPublicApi,
} from '@oryd/kratos-client';

const SESSION_STATE_KEY = 'hydra_login_state';

@Component
export default class LoginPage extends Vue {
  async asyncData(ctx: Context) {
    const { query, req, redirect, error } = ctx;

    if (!query.login_challenge) {
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
      const { data: login_request } = await hydra_admin_client.getLoginRequest(
        String(query.login_challenge)
      );

      // If auth can be skipped, accept the request and redirect
      if (login_request.skip) {
        const { data: accepted_request } = await hydra_admin_client.acceptLoginRequest(
          String(query.login_challenge),
          {
            subject: login_request.subject,
          }
        );

        return redirect(accepted_request.redirect_to);
      }

      // If the secure session key doesn't exist or doesn't match, (re)create it and redirect to the login flow
      if (
        !req.session[SESSION_STATE_KEY] ||
        query[SESSION_STATE_KEY] !== req.session[SESSION_STATE_KEY]
      ) {
        const state = crypto.randomBytes(48).toString('hex');
        req.session[SESSION_STATE_KEY] = state;

        const return_to = new URL(`/oauth2/login`, process.env.BASE_URL);
        return_to.searchParams.set(SESSION_STATE_KEY, state);
        return_to.searchParams.set('login_challenge', String(query.login_challenge));

        const destination = new URL(`/self-service/login/browser`, process.env.BASE_URL);
        destination.searchParams.set('return_to', return_to.toString());
        return redirect(destination.toString());
      }

      // We know we have a valid session state. Let's grab the Kratos session and accept the Hydra request.
      const kratos_public_client = new KratosPublicApi(
        new KratosConfiguration({
          basePath: process.env.KRATOS_PUBLIC_URL,
        })
      );
      console.log(req.headers);
      const { data: login_session } = await kratos_public_client.whoami(
        String(req.headers.cookie),
        String(req.headers.authorization)
      );
      const { data: accepted_request } = await hydra_admin_client.acceptLoginRequest(
        String(query.login_challenge),
        {
          subject: login_session.identity.id,
          context: login_session,
          remember: true,
          remember_for: 0,
        }
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

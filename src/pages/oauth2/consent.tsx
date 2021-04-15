import { Context } from '@nuxt/types';
import { AdminApi as HydraAdminApi, ConsentRequest } from '@oryd/hydra-client';
import { PublicApi as KratosPublicApi } from '@oryd/kratos-client';
import { Component, Vue } from 'nuxt-property-decorator';
import FormWrapper from '~/components/form-wrapper';

@Component
export default class ConsentPage extends Vue {
  consent_request!: ConsentRequest;

  async asyncData({ query, req, redirect, error }: Context) {
    if (!query.consent_challenge) {
      return error({
        statusCode: 400,
        message: 'Invalid login session',
      });
    }

    const hydra_admin_client = new HydraAdminApi({ basePath: process.env.HYDRA_ADMIN_URL });
    const kratos_client = new KratosPublicApi({ basePath: process.env.KRATOS_PUBLIC_URL });

    try {
      const { data: consent_request } = await hydra_admin_client.getConsentRequest(
        String(query.consent_challenge)
      );

      if (consent_request.skip || (consent_request.client?.metadata as any).first_party || false) {
        const { data: login_session } = await kratos_client.whoami(
          String(req.headers.cookie),
          String(req.headers.authorization)
        );
        const traits = login_session.identity.traits as any;
        const { data: accepted_request } = await hydra_admin_client.acceptConsentRequest(
          String(query.consent_challenge),
          {
            grant_scope: consent_request.requested_scope,
            grant_access_token_audience: consent_request.requested_access_token_audience,
            remember: true,
            remember_for: 0,
            session: {
              access_token: {
                email: traits.email,
                email_verified: !!(login_session.identity.verifiable_addresses || []).find(
                  (addr) => addr.value === traits.email && addr.verified
                ),
                nickname: traits.username,
              },
              id_token: {
                email: traits.email,
                email_verified: !!(login_session.identity.verifiable_addresses || []).find(
                  (addr) => addr.value === traits.email && addr.verified
                ),
                nickname: traits.username,
              },
            },
          }
        );

        return redirect(accepted_request.redirect_to);
      }

      return { consent_request };
    } catch (err) {
      if (err.response?.data?.error) {
        return error({
          statusCode: err.response.data.error.code,
          message: err.response.data.error.message,
        });
      } else {
        return error({
          statusCode: 500,
          message: 'An unknown error has occurred',
        });
      }
    }
  }

  render() {
    const { challenge, client, requested_scope } = this.consent_request;

    return (
      <FormWrapper
        title="Authorization"
        subtitle={`The application, ${
          client?.client_name || client?.client_id || 'No Name'
        }, wants to act on your behalf with the following access:`}
        {...(client?.logo_uri ? { imgSrc: client.logo_uri } : {})}
      >
        <form method="POST" action="/api/consent">
          <input type="hidden" name="challenge" value={challenge} />

          {(requested_scope || []).map((scope: any) => (
            <v-checkbox
              name="grant_scope"
              color="primary"
              id={scope}
              value={scope}
              label={scope}
              hide-details
              class="mt-4"
            />
          ))}

          <p class="mt-8">
            Do you want to be asked next time when this application wants to access your data? The
            application will not be able to ask for more permissions without your consent.
          </p>

          <v-row>
            {client?.policy_uri && (
              <v-col item>
                <a href={client.policy_uri}>Privacy policy</a>
              </v-col>
            )}
            {client?.tos_uri && (
              <v-col item>
                <a href={client.tos_uri}>Terms of service</a>
              </v-col>
            )}
          </v-row>

          <div class="pt-2 pb-8">
            <v-checkbox
              id="remember"
              name="remember"
              value="1"
              label="Do not ask me again"
              hide-details
            />
          </div>

          <v-row justify="center">
            <v-col>
              <v-btn depressed color="primary" type="submit" value="allow">
                Allow access
              </v-btn>
            </v-col>
            <v-col>
              <v-btn depressed type="submit" value="deny">
                Deny access
              </v-btn>
            </v-col>
          </v-row>
        </form>
      </FormWrapper>
    );
  }
}

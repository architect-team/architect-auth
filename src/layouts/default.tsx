import { Component, Vue } from 'vue-property-decorator';

@Component
export default class DefaultLayout extends Vue {
  render() {
    const theme = this.$vuetify.theme.currentTheme;
    const smThreshold = this.$vuetify.breakpoint.thresholds.xs;

    return (
      <v-app style={{ background: theme.background }}>
        <v-main>
          <v-container style={{ maxWidth: `${smThreshold}px` }}>
            <nuxt />
          </v-container>
        </v-main>
      </v-app>
    );
  }
}

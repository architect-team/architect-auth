import { Component, Vue } from 'vue-property-decorator';

@Component
export default class DefaultLayout extends Vue {
  render() {
    const theme = this.$vuetify.theme.currentTheme;

    return (
      <v-app style={{ background: theme.background }}>
        <v-main>
          <v-container>
            <nuxt />
          </v-container>
        </v-main>
      </v-app>
    );
  }
}

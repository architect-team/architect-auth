import { Component, Prop } from 'nuxt-property-decorator';
import { VueComponent } from '~/vue-component';

interface Props {
  title: string;
  subtitle?: string;
  img_src?: string;
}

@Component
export default class FormWrapper extends VueComponent<Props> {
  @Prop({ required: true })
  readonly title!: string;

  @Prop({ required: false, default: '' })
  readonly subtitle!: string;

  @Prop({ default: process.env.LOGO_URL })
  readonly img_src!: string;

  render() {
    return (
      <v-card outlined class="mt-8 mb-2 text-center">
        <v-card-text>
          <img
            src={this.img_src}
            alt={process.env.APP_NAME}
            class="my-2"
            style={{
              maxWidth: '150px',
              display: 'inline-block',
            }}
          />

          <v-card-title class="d-block">{this.title}</v-card-title>
          {this.subtitle && <v-card-subtitle class="text-center">{this.subtitle}</v-card-subtitle>}
        </v-card-text>
        <v-card-text>
          {this.$slots.default}
        </v-card-text>
      </v-card>
    );
  }
}

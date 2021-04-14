import { Component, Prop, Vue } from 'nuxt-property-decorator';

@Component
export default class FormWrapper extends Vue {
  @Prop({ required: true })
  readonly title!: string;

  @Prop({ required: false })
  readonly subtitle: string = '';

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
              maxWidth: 150,
              display: 'inline-block',
            }}
          />

          <h5>{this.title}</h5>

          {this.subtitle && <div>{this.subtitle}</div>}

          <slot class="mt-1 text-left" />
        </v-card-text>
      </v-card>
    );
  }
}

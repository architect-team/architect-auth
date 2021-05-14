import { UiText } from '@ory/kratos-client';
import { Component, Prop } from 'nuxt-property-decorator';
import { VueComponent } from '~/vue-component';

type KratosMessageProps = {
  message: UiText;
};

@Component
export default class KratosMessage extends VueComponent<KratosMessageProps> {
  @Prop()
  message!: UiText;

  render() {
    return (
      <v-alert type={this.message.type} text class="mb-8 text-left">
        {this.message.text}
      </v-alert>
    );
  }
}

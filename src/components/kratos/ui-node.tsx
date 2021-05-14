import { UiNode, UiNodeInputAttributes } from '@ory/kratos-client';
import { Component, Prop } from 'vue-property-decorator';
import { VueComponent } from '~/vue-component';

type KratosUiNodeProps = {
  node: UiNode;
};

@Component
export default class KratosUiNode extends VueComponent<KratosUiNodeProps> {
  @Prop()
  node!: UiNode;

  private get label() {
    if (this.node.meta.label?.text === 'ID') {
      return 'Username or email address';
    } else if ('name' in this.node.attributes && this.node.attributes.name === 'email') {
      return 'Email address';
    }

    return this.node.meta.label?.text;
  }

  private renderHiddenInput() {
    const attributes = this.node.attributes as UiNodeInputAttributes;
    return <input name={attributes.name} type="hidden" value={attributes.value} />;
  }

  private renderTextInput() {
    const attributes = this.node.attributes as UiNodeInputAttributes;
    return (
      <v-text-field
        outlined
        block
        label={this.label}
        type={attributes.type}
        required={Boolean(attributes.required)}
        name={attributes.name}
        value={attributes.value}
        error={Boolean(this.node.messages)}
      />
    );
  }

  private renderButtonInput() {
    const attributes = this.node.attributes as UiNodeInputAttributes;
    return (
      <v-btn
        block
        depressed
        color="primary"
        name={attributes.name}
        type={attributes.type}
        value={attributes.value}
        disabled={attributes.disabled}
      >
        {this.label}
      </v-btn>
    );
  }

  private renderCheckboxInput() {
    const attributes = this.node.attributes as UiNodeInputAttributes;
    return <v-checkbox name={attributes.name} value={attributes.value} label={this.label} />;
  }

  render() {
    if (this.node.type === 'input') {
      const attributes = this.node.attributes as UiNodeInputAttributes;
      switch (attributes.type) {
        case 'hidden':
          return this.renderHiddenInput();
        case 'submit':
          return this.renderButtonInput();
        case 'checkbox':
          return this.renderCheckboxInput();
        default:
          return this.renderTextInput();
      }
    }
  }
}

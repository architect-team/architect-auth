import { UiContainer } from '@ory/kratos-client';
import { Component, Prop } from 'nuxt-property-decorator';
import KratosMessage from '~/components/kratos/message';
import KratosUiNode from '~/components/kratos/ui-node';
import { VueComponent } from '~/vue-component';

type KratosUiProps = {
  ui: UiContainer;
};

@Component
export default class KratosUi extends VueComponent<KratosUiProps> {
  @Prop()
  ui!: UiContainer;

  render() {
    const messages = this.ui.messages || [];
    this.ui.nodes.forEach((node) => {
      messages.concat(node.messages || []);
    });
    return (
      <div>
        <form action={this.ui.action} method={this.ui.method}>
          {messages.map((message) => (
            <KratosMessage message={message} />
          ))}

          {this.ui.nodes.map((node) => (
            <KratosUiNode node={node} />
          ))}
        </form>
      </div>
    );
  }
}

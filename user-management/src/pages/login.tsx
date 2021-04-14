import { Component, Vue } from 'nuxt-property-decorator';

@Component
export default class LoginPage extends Vue {
  asyncData(ctx: any) {
    if (!ctx.query.flow) {
      return ctx.error({
        statusCode: 400,
        message: 'Test'
      });
    }

    return {};
  }

  render() {
    return (
      <div>test</div>
    )
  }
}

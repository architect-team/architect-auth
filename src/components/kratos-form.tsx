import {
  FormField,
  LoginFlowMethodConfig,
  RegistrationFlowMethodConfig,
} from '@oryd/kratos-client';
import { Component, Prop } from 'nuxt-property-decorator';
import { VueComponent } from '~/vue-component';

interface KratosFormProps {
  buttonPrefix?: string;
  config: LoginFlowMethodConfig | RegistrationFlowMethodConfig;
  method: string;
  divider?: boolean;
}

const field_translations = {
  to_verify: {
    title: 'Your email address',
    position: 0,
    icon: null,
  },
  identifier: {
    title: 'Username or Email address',
    position: 0,
    icon: null,
  },
  email: {
    title: 'Email address',
    position: 1,
    icon: null,
  },
  'traits.email': {
    title: 'Email address',
    position: 1,
    icon: null,
  },
  password: {
    title: 'Password',
    position: 2,
    icon: null,
  },
  'traits.username': {
    title: 'Username',
    position: 3,
    icon: null,
  },
  'traits.name.first': {
    title: 'First Name',
    position: 4,
    icon: null,
  },
  'traits.name.last': {
    title: 'Last Name',
    position: 5,
    icon: null,
  },
  'traits.website': {
    title: 'Website',
    position: 6,
    icon: null,
  },
  github: {
    title: 'GitHub',
    position: 0,
    icon: 'mdi-github',
  },
  gitlab: {
    title: 'GitLab',
    position: 1,
    icon: null,
  },
  google: {
    title: 'Google',
    position: 2,
    icon: null,
  },
};

type FieldTranslations = typeof field_translations;

const getFieldPosition = (field: FormField) =>
  field.name && field.name in field_translations
    ? field_translations[field.name as keyof FieldTranslations].position
    : Infinity;

const getLabel = (key: string) =>
  key in field_translations ? field_translations[key as keyof FieldTranslations].title : key;

const getIcon = (key: string) =>
  key in field_translations ? field_translations[key as keyof FieldTranslations].icon : null;

@Component
export default class KratosForm extends VueComponent<KratosFormProps> {
  @Prop({ default: 'Log in with' })
  buttonPrefix!: string;

  @Prop()
  config!: LoginFlowMethodConfig | RegistrationFlowMethodConfig;

  @Prop()
  method!: string;

  @Prop({ default: false })
  divider!: boolean;

  render() {
    const sorted_fields = this.config.fields.sort(
      (first: FormField, second: FormField) => getFieldPosition(first) - getFieldPosition(second)
    );

    let messages = this.config.messages || [];
    sorted_fields.forEach((field) => {
      if (field.messages) {
        messages.push(...field.messages);
      }
    });

    return (
      <form method={this.config.method} action={this.config.action}>
        {messages.map((message) => (
          <v-alert type={message.type} text class="mb-4">
            {message.text}
          </v-alert>
        ))}

        {sorted_fields.map((field) => {
          switch (field.type) {
            case 'hidden':
              return (
                <input
                  key={field.name}
                  type={field.type}
                  name={field.name}
                  value={String(field.value)}
                />
              );
            case 'submit':
              return (
                <v-btn type={field.type} name={field.name} block depressed class="mb-4">
                  <v-icon left>{getIcon(String(field.value))}</v-icon>
                  {this.buttonPrefix} {getLabel(String(field.value))}
                </v-btn>
              );
            default:
              return (
                <v-text-field
                  outlined
                  block
                  type={field.type}
                  required={field.required}
                  name={field.name}
                  label={getLabel(field.name)}
                  defaultValue={field.value}
                  error={Boolean(field.messages)}
                />
              );
          }
        })}

        {['password', 'link'].includes(this.method) && (
          <v-btn type="submit" color="primary" block depressed class="mb-6">
            Continue
          </v-btn>
        )}

        {this.divider && <v-divider class="my-1" />}
      </form>
    );
  }
}

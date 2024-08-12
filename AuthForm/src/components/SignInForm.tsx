import { FunctionComponent } from 'preact';

import { Form, useForm, buildFormConfig } from '@/form';
import { Label, TextInput, ErrorHint } from '@/form/components';
import { buildValidator, isNotEmpty, isNotNull } from '@/form/validation';
import PasswordField from './PasswordField';

const signInForm = buildFormConfig(fn => ({
  login: fn({ type: 'Text' }),
  password: fn({ type: 'Text' }),
}));

const signInValidator = buildValidator(signInForm, {
  login: isNotNull<string>().and(isNotEmpty()),
  password: isNotNull<string>().and(isNotEmpty()),
});

const SignInForm: FunctionComponent = () => {
  const { setup } = useForm({
    id: 'login',
    config: signInForm,
    onSubmit: values => {
      console.log('Login: ', values);
    },
    submitValidator: signInValidator,
  });

  return (
    <Form setup={setup.form} class="form-content">
      <h2>Sign In</h2>
      <div class="fields-wrapper">
        <Label class="field-label" setup={setup.login.label}>Login</Label>
        <TextInput class="text-input" setup={setup.login.input} />
        <ErrorHint class="error-hint" setup={setup.login.error} />

        <Label class="field-label" setup={setup.password.label}>Password</Label>
        <PasswordField setup={setup.password.input} />
        <ErrorHint class="error-hint" setup={setup.password.error} />
      </div>
      <button type="submit">Sign In</button>
    </Form>
  );
};

export default SignInForm;

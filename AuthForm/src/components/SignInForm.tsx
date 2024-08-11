import { FunctionComponent } from 'preact';

import { Form, useForm, buildFormConfig } from '@/form';
import { Label, TextInput } from '@/form/components';
import {
  buildValidator, emptyValidator,
  isNotEmpty, isNotNull,
  ErrorHint, useValidation,
} from '@/form/validation';
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
  const { setup, values } = useForm(
    signInForm,
    () => {
      const result = submit();
      if (!result) {
        console.log('Login: ', result);
      }
    });

  const { results, submit } = useValidation(signInValidator, emptyValidator(signInForm), values);

  return (
    <Form setup={setup.form} class="form-content">
      <h2>Sign In</h2>
      <div class="fields-wrapper">
        <Label class="field-label" setup={setup.login.label}>Login</Label>
        <TextInput class="text-input" setup={setup.login.input} isValid={results.login.success} />
        <ErrorHint class="error-hint" result={results.login} />

        <Label class="field-label" setup={setup.password.label}>Password</Label>
        <PasswordField setup={setup.password.input} isValid={results.password.success} />
        <ErrorHint class="error-hint" result={results.password} />
      </div>
      <button type="submit">Sign In</button>
    </Form>
  );
};

export default SignInForm;

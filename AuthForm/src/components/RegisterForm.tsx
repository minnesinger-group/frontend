import { FunctionComponent } from 'preact';

import { Form, useForm, buildFormConfig } from '@/form';
import { Label, TextInput, ErrorHint } from '@/form/components';
import {
  buildValidator,
  isAlwaysValid, isNotEmpty, isNotNull, isNull, minLength,
  error, success, FieldValidateResult,
} from '@/form/validation';
import PasswordField from './PasswordField';

const registerForm = buildFormConfig(fn => ({
  login: fn({ type: 'Text' }),
  password: fn({ type: 'Text' }),
  repeatedPassword: fn({ type: 'Text' }),
}));

const arePasswordsMatch = (pwd1: string, pwd2: string | null): FieldValidateResult<string, string> =>
  pwd1 === pwd2 ? success(pwd1) : error('Passwords do not match', pwd1);

const registerLiveValidator = buildValidator(registerForm, {
    login: isAlwaysValid(),
    password: isNull<string>()
      .or(minLength(8)
        .and((value, { repeatedPassword }) =>
          repeatedPassword === null ? success(value) : arePasswordsMatch(value, repeatedPassword),
        ),
      ),
    repeatedPassword: isNull<string>()
      .or((value, { password }) => arePasswordsMatch(value, password)),
  },
);

const registerSubmitValidator = buildValidator(registerForm, {
  login: isNotNull<string>().and(isNotEmpty()),
  password: isNotNull<string>()
    .and(minLength(8))
    .and((value, { repeatedPassword }) => arePasswordsMatch(value, repeatedPassword)),
  repeatedPassword: isNotNull<string>()
    .and((value, { password }) => arePasswordsMatch(value, password)),
});

const RegisterForm: FunctionComponent = () => {
  const { setup } = useForm({
    id: 'register',
    config: registerForm,
    onSubmit: values => {
      console.log('Register: ', values);
    },
    submitValidator: registerSubmitValidator,
    liveValidator: registerLiveValidator,
  });

  return (
    <Form setup={setup.form} class="form-content">
      <h2>Create Account</h2>
      <div class="fields-wrapper">
        <Label class="field-label" setup={setup.login.label}>Login</Label>
        <TextInput class="text-input" setup={setup.login.input} />
        <ErrorHint class="error-hint" setup={setup.login.error} />

        <Label class="field-label" setup={setup.password.label}>Password</Label>
        <PasswordField setup={setup.password.input} />
        <ErrorHint class="error-hint" setup={setup.password.error} />

        <Label setup={setup.repeatedPassword.label} class="field-label">Confirm Password</Label>
        <PasswordField setup={setup.repeatedPassword.input} />
        <ErrorHint class="error-hint" setup={setup.repeatedPassword.error} />
      </div>
      <button type="submit">Sign Up</button>
    </Form>
  );
};

export default RegisterForm;

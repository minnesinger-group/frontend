import { FunctionComponent } from 'preact';

import { Form, useForm, buildFormConfig } from '@/form';
import { Label, TextInput } from '@/form/components';
import {
  buildValidator,
  isAlwaysValid, isNotEmpty, isNotNull, isNull, minLength,
  error, success, FieldValidateResult,
  ErrorHint, useValidation,
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
  const { setup, values } = useForm(
    registerForm,
    () => {
      const result = submit();
      if (!result) {
        console.log('Register: ', result);
      }
    });

  const { results, submit } = useValidation(registerSubmitValidator, registerLiveValidator, values);

  return (
    <Form setup={setup.form} class="form-content">
      <h2>Create Account</h2>
      <div class="fields-wrapper">
        <Label class="field-label" setup={setup.login.label}>Login</Label>
        <TextInput class="text-input" setup={setup.login.input} isValid={results.login.success} />
        <ErrorHint class="error-hint" result={results.login} />

        <Label class="field-label" setup={setup.password.label}>Password</Label>
        <PasswordField setup={setup.password.input} isValid={results.password.success} />
        <ErrorHint class="error-hint" result={results.password} />

        <Label setup={setup.repeatedPassword.label} class="field-label">Confirm Password</Label>
        <PasswordField setup={setup.repeatedPassword.input} isValid={results.repeatedPassword.success} />
        <ErrorHint class="error-hint" result={results.repeatedPassword} />
      </div>
      <button type="submit">Sign Up</button>
    </Form>
  );
};

export default RegisterForm;

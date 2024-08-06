import { FunctionComponent, render } from 'preact';
import { useEffect, useState } from 'preact/hooks';

import { Form, useForm } from '@/form';
import { Label, TextInput } from '@/form/components';
import PasswordField from './PasswordField';

import './index.styl';

const SignInForm: FunctionComponent = () => {
  const { setup } = useForm(fn => ({
    login: fn({ type: 'Text' }),
    password: fn({ type: 'Text' }),
  }), values => {
    console.log('Login: ', values);
  }, []);

  return (
    <Form setup={setup.form} class="form-content">
      <h2>Sign In</h2>
      <div class="fields-wrapper">
        <Label setup={setup.login.label} class="field-label">Login</Label>
        <TextInput setup={setup.login.input} class="text-input" />
        <Label setup={setup.password.label} class="field-label">Password</Label>
        <PasswordField setup={setup.password.input} labelSetup={setup.password.label} />
      </div>
      <button type="submit">Sign In</button>
    </Form>
  );
};

const RegisterForm: FunctionComponent = () => {
  const { setup } = useForm(fn => ({
    login: fn({ type: 'Text' }),
    password: fn({ type: 'Text' }),
    repeatedPassword: fn({ type: 'Text' }),
  }), values => {
    console.log('Register: ', values);
  }, []);

  return (
    <Form setup={setup.form} class="form-content">
      <h2>Create Account</h2>
      <div class="fields-wrapper">
        <Label setup={setup.login.label} class="field-label">Login</Label>
        <TextInput setup={setup.login.input} class="text-input" />
        <Label setup={setup.password.label} class="field-label">Password</Label>
        <PasswordField setup={setup.password.input} labelSetup={setup.password.label} />
        <Label setup={setup.repeatedPassword.label} class="field-label">Confirm Password</Label>
        <PasswordField setup={setup.repeatedPassword.input} labelSetup={setup.repeatedPassword.label} />
      </div>
      <button type="submit">Sign Up</button>
    </Form>
  );
};

const SignInInfoPanel: FunctionComponent = () => {
  return (
    <div className="info-panel login">
      <h3>Already Have an Account?</h3>
      <p>If you're already a member, switch to Sign In and access your account easily</p>
      <a href="/#sign-in">Sign In</a>
    </div>
  );
};

const RegisterInfoPanel: FunctionComponent = () => {
  return (
    <div className="info-panel register">
      <h3>New Here?</h3>
      <p>Don't have an account yet? Sign Up now and join our community with just a few clicks</p>
      <a href="/#register">Sign Up</a>
    </div>
  );
};

function parseWindowHash(): 'sign-in' | 'register' | null {
  const hash = window.location.hash.substring(1);
  if (hash === 'sign-in' || hash === 'register') {
    return hash;
  } else {
    return null;
  }
}

const AuthForm: FunctionComponent = () => {
  const [mode, setMode] = useState<'sign-in' | 'register' | null>(parseWindowHash());

  useEffect(() => {
    const handleUrlChange = () => {
      setMode(parseWindowHash());
    };

    window.addEventListener('hashchange', handleUrlChange);

    return () => {
      window.removeEventListener('hashchange', handleUrlChange);
    };
  }, []);

  return (
    <div class="form-root">
      <div class={`primary-mask${mode === 'register' ? ' register-active' : ' login-active'}`}>
        <RegisterInfoPanel />
        <SignInInfoPanel />
      </div>
      <div class={`form-wrapper register${mode === 'register' ? ' active' : ''}`}>
        <RegisterForm />
      </div>
      <div class={`form-wrapper login${mode === 'sign-in' ? ' active' : ''}`}>
        <SignInForm />
      </div>
    </div>
  );
};

const app = document.getElementById('app');
if (app) {
  render(<AuthForm />, app);
}

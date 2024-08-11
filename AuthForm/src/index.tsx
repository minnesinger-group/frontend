import { FunctionComponent, render } from 'preact';
import { useEffect, useState } from 'preact/hooks';

import RegisterForm from './components/RegisterForm';
import SignInForm from './components/SignInForm';

import './index.styl';

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

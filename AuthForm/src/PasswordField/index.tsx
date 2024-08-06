import { FunctionComponent } from 'preact';
import { useState } from 'preact/hooks';
import { memo } from 'preact/compat';

import { TextInput, TextInputSetup } from '@/form/components/Input';
import { LabelSetup } from '@/form/components/Label';

import './password-field.styl';

interface PasswordFieldProps {
  setup: TextInputSetup;
  labelSetup: LabelSetup;
}

interface VisibilityIconProps {
  isShowing: boolean;
  toggleShowing: () => void;
}

const VisibilityIcon: FunctionComponent<VisibilityIconProps> = ({ isShowing, toggleShowing }) => {
  return (
    <svg
      viewBox="0 0 24 24"
      class={`visibility-icon${isShowing ? ' showing' : ''}`}
      onClick={toggleShowing}
    >
      <path
        d="M12.0001 5.25 C9.22586 5.25 6.79699 6.91121 5.12801 8.44832 C4.28012 9.22922 3.59626 10.0078 3.12442 10.5906 C2.88804 10.8825 2.70368 11.1268 2.57736 11.2997 C2.51417 11.3862 2.46542 11.4549 2.43187 11.5029 C2.41509 11.5269 2.4021 11.5457 2.393 11.559 L2.10547 12.0132 C2.4021 12.4543 2.41509 12.4731 2.43187 12.4971 C2.46542 12.5451 2.51417 12.6138 2.57736 12.7003 C2.70368 12.8732 2.88804 13.1175 3.12442 13.4094 C3.59626 13.9922 4.28012 14.7708 5.12801 15.5517 C6.79699 17.0888 9.22586 18.75 12.0001 18.75 C14.7743 18.75 17.2031 17.0888 18.8721 15.5517 C19.72 14.7708 20.4039 13.9922 20.8757 13.4094 C21.1121 13.1175 21.2964 12.8732 21.4228 12.7003 C21.4859 12.6138 21.5347 12.5451 21.5682 12.4971 C21.585 12.4731 21.598 12.4543 21.6071 12.441 L21.9035 12 C21.598 11.5457 21.585 11.5269 21.5682 11.5029 C21.5347 11.4549 21.4859 11.3862 21.4228 11.2997 C21.2964 11.1268 21.1121 10.8825 20.8757 10.5906 C20.4039 10.0078 19.72 9.22922 18.8721 8.44832 C17.2031 6.91121 14.7743 5.25 12.0001 5.25Z"
      />
      <path class="eye-pupil-fixed" />
      <path class="eye-pupil-rotating" />
      <path class="cross-line" />
    </svg>
  );
};

const PasswordField: FunctionComponent<PasswordFieldProps> = memo(({ setup, labelSetup }) => {
  const [isShowing, setShowing] = useState(false);

  const handleToggleShowing = () => {
    setShowing(!isShowing);
  };

  return (
    <label class="password-field-root" for={labelSetup.id}>
      <TextInput setup={setup} type={isShowing ? 'text' : 'password'} />
      <VisibilityIcon isShowing={isShowing} toggleShowing={handleToggleShowing} />
    </label>
  );
});

export default PasswordField;

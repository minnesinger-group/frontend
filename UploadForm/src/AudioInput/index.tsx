import { ComponentProps, FunctionComponent } from 'preact';
import { memo } from 'preact/compat';

import InlineIcon from '@/components/InlineIcon';
import TooltipIcon from '@/components/TooltipIcon';
import { FileInput } from '@/form/components';
import { FileInputProps, UploadedFile } from '@/form/components/File';
import AmplitudeChart from './AmplitudeChart';
import PreviewInput, { PreviewInputProps } from './PreviewInput';

import './audio-input.styl';

import CancelIcon from '@icons/delete.svg';

export interface AudioInputProps extends Omit<PreviewInputProps, 'isAudioDefault'> {
  audio: UploadedFile | null;
  audioInput: FileInputProps['setup'];
  onResetAudio: () => Promise<void>;
  isValid: boolean;
}

export const ResetIcon: FunctionComponent<ComponentProps<'span'>> = props => (
  <InlineIcon {...props}>
    <CancelIcon />
  </InlineIcon>
);

export const HelpIcon: FunctionComponent<{ class?: string; text: string }> = ({
  class: className,
  text,
}) => (
  <TooltipIcon class={`${className ? className : ''}`} text={text}>
    ?
  </TooltipIcon>
);

const AudioInput: FunctionComponent<AudioInputProps> = memo(
  ({ audio, audioInput, onResetAudio, preview, previewInput, onResetPreview, isValid }) => {
    console.log('AudioInput: ', audio);

    const handleResetAudio = async (e: Event) => {
      e.preventDefault();
      e.stopPropagation();
      await onResetAudio();
    };

    return (
      <FileInput class={`audio-input-field${isValid ? '' : ' invalid'}`} setup={audioInput} onDragClass="hovered">
        <div class="label-inner-wrapper">
          <AmplitudeChart audioFile={audio} />
          <PreviewInput
            preview={preview}
            isAudioDefault={
              preview !== null && preview.nameWithoutExtension === audio?.nameWithoutExtension
            }
            previewInput={previewInput}
            onResetPreview={onResetPreview}
          />
        </div>
        <p class={`audio-title${audio ? '' : ' clickable'}${isValid ? '' : ' invalid'}`}>
          {audio ? (
            <>
              {audio.name}
              <ResetIcon class="remove-audio-icon" onClick={handleResetAudio} />
            </>
          ) : (
            <>
              Track audio file is not chosen
              <HelpIcon class="audio-tooltip-icon" text="Acceptable audio file formats: mp3" />
            </>
          )}
        </p>
      </FileInput>
    );
  },
);

export default AudioInput;

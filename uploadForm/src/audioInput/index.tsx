import { FunctionComponent } from 'preact';
import { memo } from 'preact/compat';

import InlineIcon from '@/components/inlineIcon';
import TooltipIcon from '@/components/tooltipIcon';
import { FileInput } from '@/form/components';
import { FileInputProps, UploadedFile } from '@/form/components/File';
import AmplitudeChart from './amplitudeChart';
import PreviewInput, { PreviewInputProps } from './previewInput';

import CancelIcon from '@icons/delete.svg';

export interface AudioInputProps extends Omit<PreviewInputProps, 'isAudioDefault'> {
  audio: UploadedFile | null;
  audioInput: FileInputProps['setup'];
  onResetAudio: () => Promise<void>;
}

export const ResetIcon: FunctionComponent<{ class?: string }> = ({ class: className }) => (
  <InlineIcon class={`${className ? className : ''}`}>
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
  ({ audio, audioInput, onResetAudio, preview, previewInput, onResetPreview }) => {
    console.log('AudioInput: ', audio);

    const handleResetAudio = async (e: Event) => {
      e.preventDefault();
      e.stopPropagation();
      await onResetAudio();
    };

    return (
      <FileInput setup={audioInput} onDragClass="hovered">
        <div class="audioLabelInnerWrapper">
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
        <p
          class={`audioTitle ${audio ? '' : 'clickable'}`}
          onClick={e => audio && handleResetAudio(e)}
        >
          {audio ? (
            <>
              {audio.name}
              <ResetIcon class="removeAudioIcon" />
            </>
          ) : (
            <>
              Track audio file is not chosen
              <HelpIcon class="audioTooltipIcon" text="Acceptable audio file formats: mp3" />
            </>
          )}
        </p>
      </FileInput>
    );
  },
);

export default AudioInput;

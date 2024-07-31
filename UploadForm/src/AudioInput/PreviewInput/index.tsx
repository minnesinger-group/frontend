import { FunctionComponent } from 'preact';
import { memo } from 'preact/compat';

import { uint8ArrayToBase64 } from '@/transofmations/array';
import { FileInput } from '@/form/components';
import { FileInputProps, UploadedFile } from '@/form/components/File';
import { HelpIcon, ResetIcon } from '../index';

import './preview-input.styl';

import MusicFileIcon from '@icons/music-file.svg';

export interface PreviewInputProps {
  preview: UploadedFile | null;
  isAudioDefault: boolean;
  previewInput: FileInputProps['setup'];
  onResetPreview: () => Promise<void>;
}

const PreviewInput: FunctionComponent<PreviewInputProps> = memo(
  ({ preview, isAudioDefault, previewInput, onResetPreview }) => {
    console.log('PreviewInput: ', preview);

    const previewImage = preview ? uint8ArrayToBase64(preview.data) : null;

    const handleResetPreview = async (e: Event) => {
      e.preventDefault();
      e.stopPropagation();
      await onResetPreview();
    };

    return (
      <div class="preview-input-root">
        <FileInput setup={previewInput} class="preview-input-field">
          <>
            {preview && previewImage ? (
              <img src={`data:${preview.type};base64,${previewImage}`} alt={preview.name} />
            ) : (
              <MusicFileIcon />
            )}
            <p class={`preview-title ${isAudioDefault || !preview ? 'clickable' : ''}`}>
              {preview ? (
                isAudioDefault ? (
                  <>
                    Default (click here to change)
                    <ResetIcon class="remove-preview-icon" onClick={handleResetPreview} />
                  </>
                ) : (
                  <>
                    {preview.name}
                    <ResetIcon class="remove-preview-icon" onClick={handleResetPreview} />
                  </>
                )
              ) : (
                <>
                  Track preview is not chosen
                  <HelpIcon class="preview-tooltip-icon" text="Image file in any format" />
                </>
              )}
            </p>
          </>
        </FileInput>
      </div>
    );
  },
);

export default PreviewInput;

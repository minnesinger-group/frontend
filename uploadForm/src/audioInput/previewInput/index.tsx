import { FunctionComponent } from 'preact';
import { memo } from 'preact/compat';

import { uint8ArrayToBase64 } from '@/transofmations/array';
import { FileInput } from '@/form/components';
import { FileInputProps, UploadedFile } from '@/form/components/File';
import { HelpIcon, ResetIcon } from '../index';

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
      <div class="previewInputWrapper">
        <FileInput setup={previewInput}>
          <>
            {preview && previewImage ? (
              <img src={`data:${preview.type};base64,${previewImage}`} alt={preview.name} />
            ) : (
              <MusicFileIcon />
            )}
            <p
              class={`previewTitle ${isAudioDefault || !preview ? 'clickable' : ''}`}
              onClick={e =>
                (e.target as Element).tagName !== 'P' && preview && handleResetPreview(e)
              }
            >
              {preview ? (
                isAudioDefault ? (
                  <>
                    Default (click here to change)
                    <ResetIcon class="removePreviewIcon" />
                  </>
                ) : (
                  <>
                    {preview.name}
                    <ResetIcon class="removePreviewIcon" />
                  </>
                )
              ) : (
                <>
                  Track preview is not chosen
                  <HelpIcon class="previewTooltipIcon" text="Image file in any format" />
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

import { FunctionComponent, render } from 'preact';
import { useCallback, useEffect } from 'preact/hooks';
import parse from 'id3-parser';

import { Form, useForm, buildFormConfig } from '@/form';
import { Label, TextInput, NumberInput } from '@/form/components';
import { buildUploadedFile, UploadedFile } from '@/form/components/File';
import {
  buildValidator, emptyValidator,
  isAlwaysValid, isNotEmpty, isNotNull,
  ErrorHint, useValidation,
} from '@/form/validation';
import AudioInput from './AudioInput';
import mimeDB from '../mime-images.json';

import './index.styl';

const acceptedAudioFormat = ['audio/mpeg'];
const acceptedPreviewFormat = ['image/*'];

function getImageFileFullName(name: string, mimeType: string) {
  const extensions = mimeDB[mimeType.replace('image/', '')];
  return extensions ? `${name}.${extensions[0]}` : name;
}

const trackUploadForm = buildFormConfig(fn => ({
  audio: fn({ type: 'File', options: { accept: acceptedAudioFormat } }),
  preview: fn({ type: 'File', options: { accept: acceptedPreviewFormat } }),
  title: fn({ type: 'Text' }),
  artists: fn({ type: 'Text' }),
  album: fn({ type: 'Text' }),
  year: fn({ type: 'Number' }),
}));

const trackUploadValidator = buildValidator(trackUploadForm, {
  audio: isNotNull(),
  preview: isAlwaysValid(),
  title: isNotNull<string>().and(isNotEmpty()),
  artists: isAlwaysValid(),
  album: isAlwaysValid(),
  year: isAlwaysValid(),
});

const TrackUploadForm: FunctionComponent = () => {
  const { setup, values, setFieldValue, setFieldValues } = useForm(
    trackUploadForm,
    async () => {
      const result = submit();
      if (result) {
        console.log('Upload: ', result);
      }
    },
  );

  const { results, submit } = useValidation(trackUploadValidator, emptyValidator(trackUploadForm), values);

  useEffect(() => {
    const parseMetadata = async (audio: UploadedFile) => {
      const metadata = parse(audio.data);

      if (metadata) {
        const previewFile =
          metadata.image && metadata.image.data
            ? buildUploadedFile(
              getImageFileFullName(audio.nameWithoutExtension, metadata.image.mime),
              metadata.image.mime,
              new Uint8Array(metadata.image.data),
            )
            : null;

        console.log('previewFile: ', previewFile);

        await setFieldValues({
          preview: previewFile,
          title: metadata.title ?? null,
          artists: metadata.artist ?? null,
          album: metadata.album ?? null,
          year: Number.isNaN(Number(metadata.year)) ? null : Number(metadata.year),
        });
      }
    };

    if (values.audio) {
      parseMetadata(values.audio);
    }
  }, [values.audio]);

  console.log('TrackUploadForm');

  const onResetAudio = useCallback(async () => {
    await setFieldValues({
      audio: null,
      preview: null,
      title: null,
      artists: null,
      album: null,
      year: null,
    });
  }, [setFieldValues]);

  const onResetPreview = useCallback(async () => {
    console.log('onResetPreview');
    await setFieldValue('preview', null);
  }, [setFieldValue]);

  return (
    <div class="form-root">
      <Form setup={setup.form} class="form-wrapper">
        <AudioInput
          audio={values.audio}
          audioInput={setup.audio.input}
          onResetAudio={onResetAudio}
          isValid={results.audio.success}
          preview={values.preview}
          previewInput={setup.preview.input}
          onResetPreview={onResetPreview}
        />
        <div class="fields-wrapper">
          <Label setup={setup.title.label}>Title</Label>
          <TextInput setup={setup.title.input} isValid={results.title.success} />
          <ErrorHint class="error-hint" result={results.title} />

          <Label setup={setup.artists.label}>Artists</Label>
          <TextInput setup={setup.artists.input} isValid={results.artists.success} />
          <ErrorHint class="error-hint" result={results.artists} />

          <Label setup={setup.album.label}>Album</Label>
          <TextInput setup={setup.album.input} isValid={results.album.success} />
          <ErrorHint class="error-hint" result={results.album} />

          <Label setup={setup.year.label}>Year</Label>
          <NumberInput setup={setup.year.input} isValid={results.year.success} />
          <ErrorHint class="error-hint" result={results.year} />
        </div>
        <button type="submit">Upload</button>
      </Form>
    </div>
  );
};

const app = document.getElementById('app');
if (app) {
  render(<TrackUploadForm />, app);
}

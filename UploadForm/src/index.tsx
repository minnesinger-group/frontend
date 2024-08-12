import { FunctionComponent, render } from 'preact';
import { useCallback, useEffect } from 'preact/hooks';
import parse from 'id3-parser';

import { Form, useForm, buildFormConfig } from '@/form';
import { Label, TextInput, NumberInput, ErrorHint } from '@/form/components';
import { buildUploadedFile, UploadedFile } from '@/form/components/File';
import {
  buildValidator,
  isAlwaysValid, isNotEmpty, isNotNull,
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
  const { setup, values, setFieldValue, setFieldValues } = useForm({
    id: 'track-upload',
    config: trackUploadForm,
    onSubmit: async values => {
      console.log('Upload: ', values);
    },
    submitValidator: trackUploadValidator,
  });

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
          preview={values.preview}
          previewInput={setup.preview.input}
          onResetPreview={onResetPreview}
        />
        <div class="fields-wrapper">
          <Label setup={setup.title.label}>Title*</Label>
          <TextInput setup={setup.title.input} placeholder="Enter title" />
          <ErrorHint class="error-hint" setup={setup.title.error} />

          <Label setup={setup.artists.label}>Artists</Label>
          <TextInput setup={setup.artists.input} placeholder="Enter artist names" />
          <ErrorHint class="error-hint" setup={setup.artists.error} />

          <Label setup={setup.album.label}>Album</Label>
          <TextInput setup={setup.album.input} placeholder="Enter album title" />
          <ErrorHint class="error-hint" setup={setup.album.error} />

          <Label setup={setup.year.label}>Release Year</Label>
          <NumberInput setup={setup.year.input} placeholder="Enter release year" />
          <ErrorHint class="error-hint" setup={setup.year.error} />
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

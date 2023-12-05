import { FunctionComponent } from 'preact';
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'preact/hooks';
import { memo } from 'preact/compat';

import { interpolate } from '@/math/lagrangeInterpolation';
import { UploadedFile } from '@/form/components/File';

import './amplitudeChart.styl';

const audioContext = new AudioContext();

const generateSinusoid = (flipped: boolean, size: number) => {
  const data = new Float32Array(size + 1);
  for (let i = 0; i <= size; i++) {
    data[i] = Math.cos((i / 24) * Math.PI) / 9;
    if (flipped) {
      data[i] = -data[i];
    }
  }
  return data;
};

const getPolygonData = (chartData: Float32Array) => {
  return chartData
    .reduce((acc: string[], value, index) => [...acc, `${index}px ${50 * (1 - value)}%`], [])
    .join(',');
};

const getPolygonAnimationDescription = (name: string, from: string, to: string) => {
  return `
    @keyframes ${name} {
      from {
        clip-path: polygon(${from},100% 100%,0 100%)
      }
      to {
        clip-path: polygon(${to},100% 100%,0 100%)
      }
    }
  `;
};

const ANIMATION_DURATION = 0.7;
const PLACEHOLDER_ANIMATION_NAME = 'sinusoid';
const CHART_ANIMATION_NAME = 'expandChart';

const getPolygonAnimation = (
  name: typeof PLACEHOLDER_ANIMATION_NAME | typeof CHART_ANIMATION_NAME,
  iterationCount: number | 'infinite',
  fillMode: 'forwards' | 'none',
) => {
  return `${ANIMATION_DURATION}s ease-in-out 0s ${iterationCount} alternate ${fillMode} running ${name}`;
};

const PLACEHOLDER_ANIMATION = getPolygonAnimation(PLACEHOLDER_ANIMATION_NAME, 'infinite', 'none');
const CHART_ANIMATION = getPolygonAnimation(CHART_ANIMATION_NAME, 1, 'forwards');

interface AmplitudeGraphProps {
  audioFile: UploadedFile | null;
}

const AmplitudeChart: FunctionComponent<AmplitudeGraphProps> = memo(({ audioFile }) => {
  console.log('AmplitudeChart: ', audioFile);

  const chartRef = useRef<HTMLDivElement>(null);
  const [canvasWidth, setCanvasWidth] = useState(0);
  const sinusoidPolygon = useMemo(
    () => getPolygonData(generateSinusoid(false, canvasWidth)),
    [canvasWidth],
  );
  const flippedSinusoidPolygon = useMemo(
    () => getPolygonData(generateSinusoid(true, canvasWidth)),
    [canvasWidth],
  );
  const [baseChartPolygon, setBaseChartPolygon] = useState('');
  const [actualChartPolygon, setActualChartData] = useState('');

  useEffect(() => {
    const drawData = async (file: UploadedFile) => {
      const audioData = await audioContext.decodeAudioData(new Uint8Array(file.data).buffer);
      const channelData = audioData.getChannelData(0);
      const chartData = new Float32Array(canvasWidth / 4 + 1);
      for (let i = 0; i < canvasWidth + 1; i += 4) {
        const pos = Math.round((i / (canvasWidth + 1)) * channelData.length);
        chartData[i / 4 + 1] = channelData[pos];
      }

      const interpolatedData = getPolygonData(interpolate(chartData, canvasWidth + 1));

      const iteration = (e: AnimationEvent) => {
        if (chartRef.current) {
          if (e.elapsedTime % (ANIMATION_DURATION * 2) == 0) {
            setBaseChartPolygon(sinusoidPolygon);
          } else {
            setBaseChartPolygon(flippedSinusoidPolygon);
          }
          setActualChartData(interpolatedData);

          chartRef.current.style.animation = CHART_ANIMATION;
          chartRef.current.removeEventListener('animationiteration', iteration);
        }
      };

      chartRef.current?.addEventListener('animationiteration', iteration);
    };

    if (audioFile) {
      drawData(audioFile);
    }

    return () => {
      if (chartRef.current && audioFile !== null) {
        chartRef.current.style.animation = PLACEHOLDER_ANIMATION;
      }
    };
  }, [audioFile]);

  useLayoutEffect(() => {
    if (chartRef.current) {
      setCanvasWidth(chartRef.current?.clientWidth);
    }
  }, []);

  return (
    <div class="amplitudeGraphRoot">
      <style>
        {`
          ${getPolygonAnimationDescription(
            PLACEHOLDER_ANIMATION_NAME,
            sinusoidPolygon,
            flippedSinusoidPolygon,
          )}
          ${getPolygonAnimationDescription(
            CHART_ANIMATION_NAME,
            baseChartPolygon,
            actualChartPolygon,
          )}
        `}
      </style>
      <div
        ref={chartRef}
        class="chart"
        style={audioFile ? { animation: PLACEHOLDER_ANIMATION } : { height: 0 }}
      />
    </div>
  );
});

export default AmplitudeChart;

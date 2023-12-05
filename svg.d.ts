declare module '*.svg' {
  import { FunctionComponent, JSX } from 'preact';
  const content: FunctionComponent<JSX.SVGAttributes<SVGElement>>;
  export default content;
}

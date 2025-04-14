declare module '*.svg' {
  import React = require('react');

  export const ReactComponent: React.FunctionComponent<
    React.SVGProps<SVGSVGElement>
  >;
  const src: string;
  export default src;
}

declare module '*.png';
declare module '*.mp3';
declare module '*.mp4';
declare module '*.webp';

declare type Func<Input, Output> = (input: Input) => Output;

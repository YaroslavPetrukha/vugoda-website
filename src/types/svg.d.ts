// Type declarations for vite-plugin-svgr `?react` imports.
// Enables: `import Logo from '@/path/to/logo.svg?react'`
declare module '*.svg?react' {
  import * as React from 'react';
  const SVGComponent: React.FunctionComponent<
    React.SVGProps<SVGSVGElement> & { title?: string }
  >;
  export default SVGComponent;
}

declare module '*.svg' {
  const src: string;
  export default src;
}

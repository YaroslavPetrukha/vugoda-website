/**
 * @module components/sections/zhk/ZhkLakeviewRedirect
 *
 * ZHK-01 — Cross-origin redirect placeholder for /zhk/lakeview (D-19).
 * react-router's Navigate is same-origin only; for cross-origin URLs
 * we use window.location.assign() inside useEffect (post-paint).
 *
 * 1-frame flicker is unavoidable (RESEARCH §Pitfall 5) — make it look
 * intentional with branded copy + IsometricCube. User sees the redirect
 * message for ~16-50ms before the browser navigates away.
 *
 * Caller (ZhkPage) passes the externalUrl prop after looking it up via
 * projects.find for the lakeview slug with presentation === 'flagship-external'.
 *
 * aria-live="polite" ensures screen readers announce the redirect message.
 */

import { useEffect } from 'react';
import { IsometricCube } from '../../brand/IsometricCube';
import { lakeviewRedirectMessage } from '../../../content/zhk-etno-dim';

interface Props {
  url: string;
}

export function ZhkLakeviewRedirect({ url }: Props) {
  useEffect(() => {
    window.location.assign(url);
  }, [url]);

  return (
    <section className="flex flex-1 flex-col items-center justify-center gap-8 px-6 py-24">
      <IsometricCube
        variant="single"
        stroke="#A7AFBC"
        opacity={0.4}
        className="h-16 w-16"
      />
      <p className="text-base text-text-muted" aria-live="polite">
        {lakeviewRedirectMessage}
      </p>
    </section>
  );
}

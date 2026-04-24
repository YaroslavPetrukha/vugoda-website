import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

// Fontsource Montserrat — cyrillic subsets ONLY (no Latin overhead).
// Verified paths per @fontsource/montserrat@5.2.8 tarball (STACK.md).
// Do NOT import '@fontsource/montserrat' (package root) — that loads all
// Latin + ALL weights = ~300 files. Subset weights give full Ukrainian
// coverage (ЖК, ВИГОДА, Маєток Винниківський) in ~60-80KB woff2.
import '@fontsource/montserrat/cyrillic-400.css';
import '@fontsource/montserrat/cyrillic-500.css';
import '@fontsource/montserrat/cyrillic-700.css';

// Tokens + base styles (index.css uses Tailwind v4 @theme directive).
import './index.css';

// App tree (created in Plan 03 — router + layout + page stubs).
import App from './App';

const rootEl = document.getElementById('root');
if (!rootEl) {
  throw new Error('Root element #root not found in index.html');
}

createRoot(rootEl).render(
  <StrictMode>
    <App />
  </StrictMode>
);

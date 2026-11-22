import { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import AppRoutes from './AppRoutes';

import { PAGES, SITE_URL } from './seo/pages';

/** Page metadata for the prerender script (it cannot import TypeScript directly). */
export function getSeoMeta() {
  return { PAGES, SITE_URL };
}

/** Renders a route to HTML at build time (see scripts/prerender.mjs). */
export function render(url: string): string {
  return renderToString(
    <StrictMode>
      <StaticRouter location={url}>
        <AppRoutes />
      </StaticRouter>
    </StrictMode>,
  );
}

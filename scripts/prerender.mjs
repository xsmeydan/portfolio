// Prerenders each route to static HTML after `vite build`.
//
// 1. `vite build` produces the client bundle and dist/index.html (the template).
// 2. `vite build --ssr src/entry-server.tsx` produces dist-server/entry-server.js.
// 3. This script renders every route with React on the server, fills in the
//    per-page <head> tags, and writes one HTML file per route into dist/.
//
// The browser then hydrates the markup (see src/main.tsx), so crawlers and
// link previews get real content and the correct title/description per page.

import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const distDir = resolve(root, 'dist');
const serverDir = resolve(root, 'dist-server');

const { render, getSeoMeta } = await import(
  pathToFileURL(resolve(serverDir, 'entry-server.js')).href
);
const { PAGES, SITE_URL } = getSeoMeta();

const template = await readFile(resolve(distDir, 'index.html'), 'utf8');

const routes = [
  { url: '/', file: 'index.html', meta: PAGES.home },
  { url: '/blog', file: 'blog/index.html', meta: PAGES.blog },
  { url: '/connect', file: 'connect/index.html', meta: PAGES.connect },
  // Served by Netlify for unknown URLs, with a 404 status
  { url: '/404', file: '404.html', meta: PAGES.notFound },
];

const escapeHtml = (value) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

/** Replaces exactly one match of `pattern`; fails the build if the tag is missing. */
function replaceOnce(html, pattern, replacement, label) {
  let count = 0;
  const result = html.replace(pattern, () => {
    count += 1;
    return replacement;
  });
  if (count !== 1) {
    throw new Error(`prerender: expected exactly one ${label} in index.html, found ${count}`);
  }
  return result;
}

function applyMeta(html, meta) {
  const title = escapeHtml(meta.title);
  const description = escapeHtml(meta.description);
  const url = `${SITE_URL}${meta.path}`;

  html = replaceOnce(html, /<title>[\s\S]*?<\/title>/, `<title>${title}</title>`, '<title>');
  html = replaceOnce(
    html,
    /<meta name="description"[\s\S]*?\/>/,
    `<meta name="description" content="${description}" />`,
    'meta description',
  );
  html = replaceOnce(
    html,
    /<meta name="robots"[^>]*\/>/,
    `<meta name="robots" content="${meta.noindex ? 'noindex, follow' : 'index, follow'}" />`,
    'meta robots',
  );
  html = replaceOnce(
    html,
    /<link rel="canonical"[^>]*\/>/,
    meta.noindex ? '' : `<link rel="canonical" href="${url}" />`,
    'canonical link',
  );
  html = replaceOnce(html, /<meta property="og:url"[^>]*\/>/, `<meta property="og:url" content="${url}" />`, 'og:url');
  html = replaceOnce(html, /<meta property="og:title"[^>]*\/>/, `<meta property="og:title" content="${title}" />`, 'og:title');
  html = replaceOnce(
    html,
    /<meta property="og:description"[\s\S]*?\/>/,
    `<meta property="og:description" content="${description}" />`,
    'og:description',
  );
  html = replaceOnce(html, /<meta name="twitter:title"[^>]*\/>/, `<meta name="twitter:title" content="${title}" />`, 'twitter:title');
  html = replaceOnce(
    html,
    /<meta name="twitter:description"[\s\S]*?\/>/,
    `<meta name="twitter:description" content="${description}" />`,
    'twitter:description',
  );
  return html;
}

for (const route of routes) {
  const appHtml = render(route.url);
  let html = applyMeta(template, route.meta);
  html = replaceOnce(html, '<!--app-html-->', appHtml, 'app placeholder');

  const outFile = resolve(distDir, route.file);
  await mkdir(dirname(outFile), { recursive: true });
  await writeFile(outFile, html);
  console.log(`prerendered ${route.url.padEnd(9)} -> dist/${route.file} (${(html.length / 1024).toFixed(1)} kB)`);
}

// The server bundle is only needed at build time
await rm(serverDir, { recursive: true, force: true });

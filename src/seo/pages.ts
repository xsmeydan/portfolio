export const SITE_URL = 'https://sudenurmeydan.netlify.app';

export interface PageMeta {
  title: string;
  description: string;
  /** Path of the page, e.g. "/blog". Used for the canonical URL. */
  path: string;
  noindex?: boolean;
}

/**
 * Metadata for every page. Shared by usePageMeta (client-side navigation)
 * and scripts/prerender.mjs (static HTML generated at build time).
 */
export const PAGES = {
  home: {
    title: 'Sudenur Meydan | Software Engineer — Backend & AI',
    description:
      'Sudenur Meydan — Backend Software Engineer in Istanbul focused on fintech and payment systems, .NET and FastAPI services, and AI-powered tools.',
    path: '/',
  },
  blog: {
    title: 'Blog | Sudenur Meydan',
    description:
      'Notes, tutorials and insights from Sudenur Meydan on backend development, system design, databases and AI.',
    path: '/blog',
  },
  connect: {
    title: 'Connect | Sudenur Meydan',
    description:
      'Get in touch with Sudenur Meydan, Backend Software Engineer based in Istanbul and open to remote work.',
    path: '/connect',
  },
  notFound: {
    title: 'Page not found | Sudenur Meydan',
    description: 'The page you are looking for does not exist.',
    path: '/404',
    noindex: true,
  },
} satisfies Record<string, PageMeta>;

// @ts-check
import { defineConfig, envField, fontProviders } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { legacyRedirects } from './src/data/legacy.mjs';

// Production is the domain root. A GitHub Pages project site is built with SITE_URL and BASE_PATH
// from the deploy workflow (see .github/workflows/deploy.yml), so one codebase serves both.
const site = process.env['SITE_URL'] || 'https://igdrives.com';
const base = process.env['BASE_PATH'] || '/';

export default defineConfig({
  site,
  base,
  output: 'static',
  trailingSlash: 'ignore',
  build: { format: 'directory' },

  // Fallback for hosts with no redirect support. Real hosts use the generated _redirects, .htaccess or vercel.json.
  // Astro prefixes the source route with the base but not the destination, so do that here.
  redirects: Object.fromEntries(legacyRedirects.map(([from, to]) => [from, `${base.replace(/\/$/, '')}${to}`])),
  integrations: [sitemap()],

  // Archivo carries a width axis, which gives the display face its wide technical stance.
  // Martian Mono is reserved for designators and specifications.
  fonts: [
    {
      provider: fontProviders.fontsource(),
      name: 'Archivo',
      cssVariable: '--font-sans',
      weights: ['100 900'],
      styles: ['normal'],
      subsets: ['latin'],
      stretch: '62% 125%',
      display: 'swap',
      fallbacks: ['Helvetica Neue', 'Arial', 'sans-serif'],
    },
    {
      provider: fontProviders.fontsource(),
      name: 'Martian Mono',
      cssVariable: '--font-mono',
      weights: [400, 500],
      styles: ['normal'],
      subsets: ['latin'],
      display: 'swap',
      fallbacks: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
    },
  ],

  // The contact form posts here. Leave unset and the form falls back to a mailto: link,
  // so the site works on any host (Apache, Netlify, Cloudflare Pages, Vercel, S3).
  env: {
    schema: {
      PUBLIC_FORM_ENDPOINT: envField.string({ context: 'client', access: 'public', optional: true }),
    },
  },
});

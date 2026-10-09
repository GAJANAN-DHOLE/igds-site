// @ts-check
import { defineConfig, envField, fontProviders } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { legacyRedirects } from './src/data/legacy.mjs';

export default defineConfig({
  site: 'https://igdrives.com',
  output: 'static',
  trailingSlash: 'ignore',
  build: { format: 'directory' },

  // Fallback for hosts with no redirect support. Real hosts use the generated _redirects, .htaccess or vercel.json.
  redirects: Object.fromEntries(legacyRedirects),
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

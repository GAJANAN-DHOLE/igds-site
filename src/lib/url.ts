/* The site can be served from a domain root (igdrives.com) or from a sub-path (a GitHub Pages
   project site such as /igds-site). Astro only rewrites its own asset URLs, so every
   hand-written root-relative link goes through withBase(). */

const base = import.meta.env.BASE_URL.replace(/\/+$/, '');

/** Prefix a root-relative path with the deployment base: '' on a domain root, '/igds-site' on a project site. */
export function withBase(path: string): string {
  return path.startsWith('/') && !path.startsWith('//') ? `${base}${path}` : path;
}

/** Remove the deployment base from a pathname, so route comparisons work wherever the site is served. */
export function stripBase(pathname: string): string {
  if (base && (pathname === base || pathname.startsWith(`${base}/`))) return pathname.slice(base.length) || '/';
  return pathname;
}

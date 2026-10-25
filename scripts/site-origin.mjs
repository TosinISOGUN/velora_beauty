/**
 * The origin the site is served from, used for canonical links, Open Graph image URLs, the
 * sitemap and robots.txt. Order: an explicit SITE_URL, then the Vercel production domain
 * (the custom domain once one is attached) or the deployment URL for previews, then the
 * fallback. Social crawlers need absolute URLs that actually resolve, so a hard-coded domain
 * that is not live yet would leave shared links without an image.
 */
export function siteOrigin(fallback) {
  const env = process.env;
  const host = env.VERCEL_ENV === "production" ? env.VERCEL_PROJECT_PRODUCTION_URL : env.VERCEL_URL;
  const raw = env.SITE_URL || (host ? `https://${host}` : fallback);
  return raw.replace(/\/+$/, "");
}

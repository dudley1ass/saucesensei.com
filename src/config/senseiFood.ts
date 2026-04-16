/**
 * SenseiFood site integration. Set `VITE_SENSEIFOOD_SITE_URL` in `.env` (no trailing slash).
 * Example: https://senseifood.com
 */
export function senseiFoodSiteBase(): string {
  const raw = import.meta.env.VITE_SENSEIFOOD_SITE_URL as string | undefined;
  const trimmed = (raw ?? '').replace(/\/+$/, '');
  return trimmed || 'https://senseifood.com';
}

export function senseiFoodArticleUrl(slugOrPath: string): string {
  const normalized = slugOrPath.trim().replace(/^\/+/, '');
  if (!normalized) return `${senseiFoodSiteBase()}/articles`;

  // Sensei Kitchen routes content as /<segment>/<slug>. Keep slug fallback for legacy links.
  if (normalized.includes('/')) return `${senseiFoodSiteBase()}/${normalized}`;
  return `${senseiFoodSiteBase()}/articles/${encodeURIComponent(normalized)}`;
}

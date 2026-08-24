/**
 * URL safety helpers.
 *
 * This app is a directory of links, so a hostile or malformed URL is the
 * most likely attack surface. Postgres CHECK constraints already reject
 * anything that isn't http(s) at write time — these helpers are the
 * matching client-side guard, plus safe rendering utilities.
 *
 * Never render a user-supplied URL into an href without running it through
 * `toSafeHref` first: `javascript:` and `data:` URLs execute in the page.
 */

const ALLOWED_PROTOCOLS = new Set(['http:', 'https:']);

/** Attributes every outbound link must carry. */
export const SAFE_LINK_REL = 'noopener noreferrer nofollow ugc';

/** Parses a URL, returning null for anything malformed or non-http(s). */
export function parseSafeUrl(raw: string | null | undefined): URL | null {
  if (!raw) return null;
  try {
    const url = new URL(raw);
    return ALLOWED_PROTOCOLS.has(url.protocol) ? url : null;
  } catch {
    return null;
  }
}

export function isSafeHttpUrl(raw: string | null | undefined): boolean {
  return parseSafeUrl(raw) !== null;
}

/**
 * Returns a URL safe to place in href/src, or `about:blank` if it isn't.
 * Fails closed — an unsafe link becomes inert rather than dangerous.
 */
export function toSafeHref(raw: string | null | undefined): string {
  return parseSafeUrl(raw)?.href ?? 'about:blank';
}

export function getHostname(raw: string | null | undefined): string {
  return parseSafeUrl(raw)?.hostname ?? '';
}

/**
 * Accepts what a human would type ("example.com") and returns a canonical
 * https URL, or null if it can't be made into a safe one.
 */
export function normalizeUserUrl(input: string): string | null {
  const trimmed = input.trim();
  if (!trimmed) return null;

  const candidate = /^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(trimmed)
    ? trimmed
    : `https://${trimmed}`;

  const parsed = parseSafeUrl(candidate);
  if (!parsed || !parsed.hostname.includes('.')) return null;
  return parsed.href;
}

/**
 * Icon fetching service — a fixed allow-listed host, never user-controlled.
 * Given just the site's hostname it returns that brand's actual icon, so a
 * tool added with no logo still gets a real image instead of a generic
 * favicon.
 */
export function getIconHorseUrl(rawUrl: string | null | undefined): string | null {
  const hostname = getHostname(rawUrl);
  if (!hostname) return null;
  return `https://icon.horse/icon/${encodeURIComponent(hostname)}`;
}

/**
 * Picks the image to show for a tool: an explicit safe logo URL, else an
 * icon auto-fetched for the tool's own site. Rejects base64/data: payloads
 * in the logo_url column, which the database also refuses to store --
 * uploaded logos go through Supabase Storage instead and come back as a
 * real https URL, so they pass through the same safe-URL path.
 */
export function resolveLogoSrc(
  logoUrl: string | null | undefined,
  toolUrl: string | null | undefined,
): string | null {
  if (isSafeHttpUrl(logoUrl)) return logoUrl as string;
  return getIconHorseUrl(toolUrl);
}

/** Inline SVG monogram used when every remote image fails to load. */
export function monogramDataUri(name: string): string {
  const letter = (name.trim().charAt(0) || '?').toUpperCase();
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="none"/><text x="50%" y="50%" dy=".35em" text-anchor="middle" font-family="Orbitron, sans-serif" font-weight="bold" font-size="60" fill="white">${letter.replace(/[<>&"]/g, '')}</text></svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

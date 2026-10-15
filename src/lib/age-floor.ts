/**
 * Port of website js/age-floor-keywords.js. The app has no stored viewer age,
 * and the web rule is "unknown age = under-13", so the app always applies the floor.
 */
const ADULT_KEYWORD_RE = /(^|\W)(13|16|17|18|21)\s?\+(?!\w)|\bPG-?13\b|\b(nsfw|explicit)\b/i;

export function isAdultKeyword(text: unknown): boolean {
  let s = String(text == null ? '' : text);
  if (typeof s.normalize === 'function') s = s.normalize('NFKC');
  return ADULT_KEYWORD_RE.test(s);
}

/** G/PG rating floor: G, PG, G-PG, GPG pass; PG-13, R and missing do not. */
export function ratingIsGPG(rating: unknown): boolean {
  if (rating == null) return false;
  let r = String(rating);
  if (typeof r.normalize === 'function') r = r.normalize('NFKC');
  r = r.trim().toUpperCase().replace(/\s+/g, '').replace(/[\u2010-\u2015/]/g, '-');
  return r === 'G' || r === 'PG' || r === 'G-PG' || r === 'GPG';
}

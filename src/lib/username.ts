export const LOGIN_RE = /^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i;

/** Accepts "torvalds", "@torvalds" or "https://github.com/torvalds". */
export function cleanUsername(input: string): string {
  return input
    .trim()
    .replace(/^https?:\/\/(www\.)?github\.com\//i, "")
    .replace(/^@/, "")
    .split(/[/?#]/)[0];
}
const cooldown = new Map<string, number>(); // token -> usable again at (ms)
let cursor = 0;

export function getTokens(): string[] {
  const raw = process.env.GITHUB_TOKENS || process.env.GITHUB_TOKEN || "";
  return raw
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
}

/** Round-robin over tokens that are not cooling down, or null if none are usable. */
export function pickToken(now = Date.now()): string | null {
  const all = getTokens();
  for (let i = 0; i < all.length; i++) {
    const token = all[(cursor + i) % all.length];
    if ((cooldown.get(token) ?? 0) <= now) {
      cursor = (cursor + i + 1) % all.length;
      return token;
    }
  }
  return null;
}

export function markLimited(token: string, untilMs: number): void {
  cooldown.set(token, untilMs);
}

export function resetTokenState(): void {
  cooldown.clear();
  cursor = 0;
}
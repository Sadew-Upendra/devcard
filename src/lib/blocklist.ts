export function isBlocked(login: string): boolean {
  const list = (process.env.BLOCKED_LOGINS ?? "")
    .toLowerCase()
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  return list.includes(login.toLowerCase());
}
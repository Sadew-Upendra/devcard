import { fetchGitHubUser } from "../src/lib/github/client";
import { buildCard } from "../src/lib/scoring/card";

const USERS = [
  "torvalds", "gaearon", "sindresorhus", "tj", "yyx990803",
  "antfu", "addyosmani", "kentcdodds", "octocat", "ghost",
];

async function main() {
  const rows = [];
  for (const login of USERS) {
    try {
      const c = buildCard(await fetchGitHubUser(login));
      rows.push({
        login: c.login, OVR: c.overall, tier: c.tier, pos: c.position,
        ...c.stats, lang: c.topLanguage,
      });
    } catch (e) {
      rows.push({ login, OVR: "ERR", tier: (e as Error).message });
    }
  }
  console.table(rows);
}

main();
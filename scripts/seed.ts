import { getPool } from "../src/lib/db";
import { fetchGitHubUser } from "../src/lib/github/client";
import { searchLogins } from "../src/lib/github/search";
import { GitHubError } from "../src/lib/github/types";
import { getStoredCard, savePlayer } from "../src/lib/players";
import { buildCard } from "../src/lib/scoring/card";

async function main() {
  const [locationArg, minArg, maxArg, limitArg] = process.argv.slice(2);
  if (!locationArg) {
    console.error('Usage: npm run seed -- "Sri Lanka" 5 0 300');
    process.exit(1);
  }
  const location = locationArg.replace(/"/g, "");
  const minF = Number(minArg ?? 5);
  const maxF = Number(maxArg ?? 0);
  const limit = Number(limitArg ?? 200);

  const range = maxF > 0 ? `${minF}..${maxF}` : `>=${minF}`;
  const query = `location:"${location}" followers:${range} sort:followers-desc`;
  console.log(`Searching: ${query}`);

  const logins = await searchLogins(query, limit);
  console.log(`Found ${logins.length} users`);

  const queue = [...logins];
  let done = 0;
  let saved = 0;
  let stop = false;

  async function worker() {
    while (queue.length && !stop) {
      const login = queue.shift()!;
      try {
        if (!(await getStoredCard(login))) {
          await savePlayer(buildCard(await fetchGitHubUser(login)));
          saved++;
        }
      } catch (e) {
        if (e instanceof GitHubError && e.code === "RATE_LIMITED") {
          stop = true;
          console.error("Rate limited. Wait a bit and run the command again.");
        } else {
          console.error(`skip ${login}: ${(e as Error).message}`);
        }
      }
      done++;
      if (done % 25 === 0) console.log(`${done}/${logins.length}`);
    }
  }

  await Promise.all(Array.from({ length: 4 }, worker));
  console.log(`Done. Saved ${saved} new players.`);
  await getPool()?.end();
}

main();
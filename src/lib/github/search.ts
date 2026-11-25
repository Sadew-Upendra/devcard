import { GitHubError } from "./types";
import { pickToken } from "./tokens";

const ENDPOINT = "https://api.github.com/graphql";

const SEARCH_QUERY = /* GraphQL */ `
  query ($q: String!, $after: String) {
    search(query: $q, type: USER, first: 100, after: $after) {
      pageInfo { endCursor hasNextPage }
      nodes { ... on User { login } }
    }
  }
`;

export async function searchLogins(q: string, max: number): Promise<string[]> {
  const logins: string[] = [];
  let after: string | null = null;

  while (logins.length < max) {
    const token = pickToken();
    if (!token) throw new GitHubError("RATE_LIMITED", "All GitHub tokens are rate limited.");

    const res: Response = await fetch(ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query: SEARCH_QUERY, variables: { q, after } }),
    });
    const json = await res.json();
    if (!res.ok || json.errors) {
      throw new GitHubError(
        "UPSTREAM",
        json.errors?.[0]?.message ?? `GitHub returned ${res.status}.`
      );
    }
    const search = json.data.search;
    for (const n of search.nodes) if (n?.login) logins.push(n.login);
    if (!search.pageInfo.hasNextPage) break;
    after = search.pageInfo.endCursor;
  }
  return logins.slice(0, max);
}
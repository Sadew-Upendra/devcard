export const USER_QUERY = /* GraphQL */ `
  query DevCardUser($login: String!) {
    rateLimit { cost remaining resetAt }
    user(login: $login) {
      login
      name
      avatarUrl
      location
      createdAt
      followers { totalCount }
      pullRequests(states: MERGED) { totalCount }
      repositories(
        ownerAffiliations: OWNER
        isFork: false
        first: 100
        orderBy: { field: STARGAZERS, direction: DESC }
      ) {
        nodes { stargazerCount primaryLanguage { name } }
      }
      contributionsCollection {
        totalCommitContributions
        totalIssueContributions
        totalPullRequestContributions
        totalPullRequestReviewContributions
        contributionCalendar {
          totalContributions
          weeks { contributionDays { contributionCount date } }
        }
      }
    }
  }
`;
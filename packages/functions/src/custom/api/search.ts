import type { RestEndpointMethodTypes } from "@octokit/rest";

export async function searchissuesandpullrequests({
  q,
  per_page,
  page,
  token,
}: {
  q: string;
  per_page: string;
  page: string;
  token: string;
}): Promise<{
  incomplete_results: boolean;
  total_count: number;
  items:
    | RestEndpointMethodTypes["search"]["issuesAndPullRequests"]["response"]["data"]["items"]
    | undefined;
}> {
  const response = await fetch(
    `https://api.github.com/search/issues?q=${q}&per_page=${per_page}&page=${page}`,
    {
      method: "GET",
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${token}`,
        "X-GitHub-Api-Version": "2022-11-28",
      },
    }
  );

  if (!response.ok) {
    throw new Error(
      `Error fetching issues and pull requests: ${response.statusText}`
    );
  }

  const data = await response.json();
  
  return data;
}

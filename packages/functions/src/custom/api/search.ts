import { log } from "../../utils/logger";
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
    log.error(
      `[searchissuesandpullrequests]: error fetching issues and pull requests: ${response.statusText}`
    );
    throw new Error(
      `Error fetching issues and pull requests: ${response.statusText}`
    );
  }

  const data = await response.json();
  if (data.items.length === 0) {
    log.warn("No issues or pull requests found.");
    return {
      incomplete_results: false,
      total_count: 0,
      items: [],
    };
  }

  log.info("Issues and pull requests fetched successfully.");
  return data;
}

"use server";

import { auth } from "@/auth";
import { log } from "@/lib/logger";
import { searchissuesandpullrequests } from "@noutify/functions/custom/api";

import type { RestEndpointMethodTypes } from "@octokit/plugin-rest-endpoint-methods";

export async function loadMorePullRequests(
  nextPage: number,
  q: string
): Promise<{
  total_count: number;
  nextPage: number;
  hasMore: boolean | undefined;
  pullRequests:
    | RestEndpointMethodTypes["search"]["issuesAndPullRequests"]["response"]["data"]["items"]
    | undefined;
}> {
  const session = await auth();
  log.debug(`Loading more pull requests for query: ${q}`);
  const {
    incomplete_results,
    total_count,
    items: pullRequests,
  } = await searchissuesandpullrequests({
    q,
    per_page: "15",
    page: nextPage.toString(),
    token: session.user.accessToken,
  });

  log.info(
    `Loaded ${pullRequests?.length} pull requests, total count: ${total_count}`
  );
  return {
    pullRequests,
    nextPage,
    hasMore: pullRequests && pullRequests.length > 0 && !incomplete_results,
    total_count,
  };
}

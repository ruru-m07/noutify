import type { Octokit } from "@octokit/rest";
import type { RestEndpointMethodTypes } from "@octokit/rest";

import { getGitHubHeaders } from "../utils";

export class SearchAPI {
  constructor(
    private octokit: Octokit,
    private apiVersion: string
  ) {}

  //   async getAuthenticatedUser(): Promise<
  //     RestEndpointMethodTypes["users"]["getAuthenticated"]["response"]["data"]
  //   > {
  //     const response = await this.octokit.users.getAuthenticated({
  //       headers: getGitHubHeaders(this.apiVersion),
  //     });
  //     return response.data;
  //   }

  async listUserPullRequests(
    username: string,
    q?: string
  ): Promise<
    | RestEndpointMethodTypes["search"]["issuesAndPullRequests"]["response"]["data"]["items"]
    | undefined
  > {
    try {
      const response = await this.octokit.search.issuesAndPullRequests({
        q: `is:pr author:${username} ${q}`,
        // sort: "updated",
        // order: "desc",
      });

      const pullRequests = response.data.items;

      return pullRequests;
    } catch (error) {
      console.error("Error fetching pull requests: ", error);
    }
  }
}

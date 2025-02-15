import type { Octokit } from "@octokit/rest";
import type { RestEndpointMethodTypes } from "@octokit/rest";

import { getGitHubHeaders } from "../utils";

export class PullsAPI {
  constructor(
    private octokit: Octokit,
    private apiVersion: string
  ) {}

  async get(
    owner: string,
    repo: string,
    pull_number: number
  ): Promise<RestEndpointMethodTypes["pulls"]["get"]["response"]["data"]> {
    const response = await this.octokit.pulls.get({
      owner,
      repo,
      pull_number,
      headers: getGitHubHeaders(this.apiVersion),
    });

    return response.data;
  }
}

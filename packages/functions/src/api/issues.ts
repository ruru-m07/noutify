import type { Octokit } from "@octokit/rest";
import type { RestEndpointMethodTypes } from "@octokit/rest";

import { getGitHubHeaders } from "../utils";

export class IssuesAPI {
  constructor(
    private octokit: Octokit,
    private apiVersion: string
  ) {}

  async get(
    owner: string,
    repo: string,
    issue_number: number
  ): Promise<RestEndpointMethodTypes["issues"]["get"]["response"]["data"]> {
    const response = await this.octokit.issues.get({
      owner,
      repo,
      issue_number,
      headers: getGitHubHeaders(this.apiVersion),
    });

    return response.data;
  }
}

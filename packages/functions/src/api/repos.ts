import type { Octokit } from "@octokit/rest";
import type { RestEndpointMethodTypes } from "@octokit/rest";

import { getGitHubHeaders } from "../utils";

export class ReposAPI {
  constructor(
    private octokit: Octokit,
    private apiVersion: string
  ) {}

  async listRepositories(
    params?: Partial<
      RestEndpointMethodTypes["repos"]["listForAuthenticatedUser"]["parameters"]
    >
  ): Promise<
    RestEndpointMethodTypes["repos"]["listForAuthenticatedUser"]["response"]["data"]
  > {
    const response = await this.octokit.repos.listForAuthenticatedUser({
      ...params,
      headers: getGitHubHeaders(this.apiVersion),
    });
    return response.data;
  }

  async getRepository(
    owner: string,
    repo: string
  ): Promise<RestEndpointMethodTypes["repos"]["get"]["response"]["data"]> {
    const response = await this.octokit.repos.get({
      owner,
      repo,
      headers: getGitHubHeaders(this.apiVersion),
    });
    return response.data;
  }
}

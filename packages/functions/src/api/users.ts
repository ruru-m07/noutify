import type { Octokit } from "@octokit/rest";
import type { RestEndpointMethodTypes } from "@octokit/rest";

import { getGitHubHeaders } from "../utils";

export class UsersAPI {
  constructor(
    private octokit: Octokit,
    private apiVersion: string
  ) {}

  async getAuthenticatedUser(): Promise<
    RestEndpointMethodTypes["users"]["getAuthenticated"]["response"]["data"]
  > {
    const response = await this.octokit.users.getAuthenticated({
      headers: getGitHubHeaders(this.apiVersion),
    });
    return response.data;
  }
}

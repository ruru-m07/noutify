import type { Octokit } from "@octokit/rest";
import type { RestEndpointMethodTypes } from "@octokit/rest";

import { getGitHubHeaders } from "../utils";
import { log } from "../utils/logger";

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
    log.info(
      "[users:getAuthenticatedUser]: authenticated user fetched successfully"
    );
    return response.data;
  }
}

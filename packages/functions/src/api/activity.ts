import type { Octokit } from "@octokit/rest";
import type { RestEndpointMethodTypes } from "@octokit/rest";

import { getGitHubHeaders } from "../utils";
import { log } from "../utils/logger";

export class ActivityAPI {
  constructor(
    private octokit: Octokit,
    private apiVersion: string
  ) {}

  async listNotifications(
    params?: Partial<
      RestEndpointMethodTypes["activity"]["listNotificationsForAuthenticatedUser"]["parameters"]
    >
  ): Promise<
    RestEndpointMethodTypes["activity"]["listNotificationsForAuthenticatedUser"]["response"]["data"]
  > {
    const { data } =
      await this.octokit.activity.listNotificationsForAuthenticatedUser({
        ...params,
        headers: getGitHubHeaders(this.apiVersion),
      });
    log.info("[listNotifications]: notifications fetched successfully");
    return data;
  }

  async getThread(
    params: RestEndpointMethodTypes["activity"]["getThread"]["parameters"]
  ): Promise<
    RestEndpointMethodTypes["activity"]["getThread"]["response"]["data"]
  > {
    const { data } = await this.octokit.activity.getThread({
      ...params,
      headers: getGitHubHeaders(this.apiVersion),
    });
    log.info("[getThread]: thread fetched successfully");
    return data;
  }
}

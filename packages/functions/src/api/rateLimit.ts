import type { Octokit } from "@octokit/rest";
import type { RestEndpointMethodTypes } from "@octokit/rest";

import { getGitHubHeaders } from "../utils";
import { log } from "../utils/logger";

export class RateLimitAPI {
  constructor(
    private octokit: Octokit,
    private apiVersion: string
  ) {}

  async getRateLimit(
    params?: Partial<RestEndpointMethodTypes["rateLimit"]["get"]["parameters"]>
  ): Promise<RestEndpointMethodTypes["rateLimit"]["get"]["response"]["data"]> {
    const { data } = await this.octokit.rateLimit.get({
      headers: getGitHubHeaders(this.apiVersion),
      ...params,
    });
    log.info("[rateLimit:getRateLimit]: rate limit fetched successfully");
    if (data.rate?.remaining === 0) {
      log.warn("[rateLimit:getRateLimit]: rate limit exceeded");
    }
    return data;
  }
}

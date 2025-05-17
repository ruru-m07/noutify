import type { Octokit } from "@octokit/rest";
import type { RestEndpointMethodTypes } from "@octokit/rest";

import { getGitHubHeaders } from "../utils";
import { log } from "../utils/logger";

export class ReactionsAPI {
  constructor(
    private octokit: Octokit,
    private apiVersion: string
  ) {}

  async listForIssue(
    owner: string,
    repo: string,
    number: number
  ): Promise<
    RestEndpointMethodTypes["reactions"]["listForIssue"]["response"]["data"]
  > {
    const response = await this.octokit.reactions.listForIssue({
      owner,
      repo,
      issue_number: number,
      per_page: 300,
      headers: getGitHubHeaders(this.apiVersion),
    });
    log.info("[reactions:listForIssue]: reactions fetched successfully");
    return response.data;
  }

  async createForIssue(
    owner: string,
    repo: string,
    number: number,
    content: RestEndpointMethodTypes["reactions"]["createForIssue"]["parameters"]["content"]
  ): Promise<
    RestEndpointMethodTypes["reactions"]["createForIssue"]["response"]["data"]
  > {
    const response = await this.octokit.reactions.createForIssue({
      owner,
      repo,
      issue_number: number,
      content,
      headers: getGitHubHeaders(this.apiVersion),
    });
    log.info("[reactions:createForIssue]: reaction created successfully");
    return response.data;
  }

  async deleteForIssue(
    owner: string,
    repo: string,
    number: number,
    reaction_id: number
  ): Promise<{
    success: boolean;
  }> {
    const response = await this.octokit.reactions.deleteForIssue({
      owner,
      repo,
      issue_number: number,
      reaction_id,
      headers: getGitHubHeaders(this.apiVersion),
    });

    if (response.status !== 204) {
      log.error(
        `[reactions:deleteForIssue]: failed to delete reaction, status code: ${response.status}`
      );
      return { success: false };
    }

    log.info("[reactions:deleteForIssue]: reaction deleted successfully");
    return { success: true };
  }
}

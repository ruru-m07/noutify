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

  async list(
    owner: string,
    repo: string
  ): Promise<RestEndpointMethodTypes["pulls"]["list"]["response"]["data"]> {
    const response = await this.octokit.pulls.list({
      owner,
      repo,
      headers: getGitHubHeaders(this.apiVersion),
    });

    return response.data;
  }

  async listEvents(
    owner: string,
    repo: string,
    pull_number: number
  ): Promise<
    RestEndpointMethodTypes["issues"]["listEventsForTimeline"]["response"]["data"]
  > {
    const response = await this.octokit.issues.listEventsForTimeline({
      owner,
      repo,
      issue_number: pull_number,
      per_page: 100,
      headers: getGitHubHeaders(this.apiVersion),
    });

    return response.data;
  }

  async listReviewComments(
    owner: string,
    repo: string,
    pull_number: number
  ): Promise<
    RestEndpointMethodTypes["pulls"]["listReviewComments"]["response"]["data"]
  > {
    const response = await this.octokit.pulls.listReviewComments({
      owner,
      repo,
      pull_number,
      headers: getGitHubHeaders(this.apiVersion),
    });

    return response.data;
  }
}

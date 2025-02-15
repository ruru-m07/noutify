import { Octokit } from "@octokit/rest";

import { UsersAPI } from "./api/users";
import { ActivityAPI } from "./api/activity";
import { ReposAPI } from "./api/repos";
import { PullsAPI } from "./api/pulls";

export interface GithubClientOptions {
  token: string;
  /**
   * ? Optionally override the default GitHub API version.
   */
  apiVersion?: string;
}

export class GithubClient {
  public readonly users: UsersAPI;
  public readonly activity: ActivityAPI;
  public readonly repos: ReposAPI;
  public readonly pulls: PullsAPI;

  private octokit: Octokit;
  private apiVersion: string;

  constructor(options: GithubClientOptions) {
    this.apiVersion = options.apiVersion ?? "2022-11-28";
    this.octokit = new Octokit({
      auth: options.token,
    });

    // ! Instantiate domain-specific APIs
    this.users = new UsersAPI(this.octokit, this.apiVersion);
    this.activity = new ActivityAPI(this.octokit, this.apiVersion);
    this.repos = new ReposAPI(this.octokit, this.apiVersion);
    this.pulls = new PullsAPI(this.octokit, this.apiVersion);
  }
}

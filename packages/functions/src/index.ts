import { Octokit } from "@octokit/rest";

import { UsersAPI } from "./api/users";
import { ActivityAPI } from "./api/activity";
import { ReposAPI } from "./api/repos";
import { PullsAPI } from "./api/pulls";
import { IssuesAPI } from "./api/issues";
import { SearchAPI } from "./api/search";
import { ReactionsAPI } from "./api/reactions";
import { RateLimitAPI } from "./api/rateLimit";

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
  public readonly issues: IssuesAPI;
  public readonly search: SearchAPI;
  public readonly reactions: ReactionsAPI;
  public readonly rateLimit: RateLimitAPI;

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
    this.issues = new IssuesAPI(this.octokit, this.apiVersion);
    this.search = new SearchAPI(this.octokit, this.apiVersion);
    this.reactions = new ReactionsAPI(this.octokit, this.apiVersion);
    this.rateLimit = new RateLimitAPI(this.octokit, this.apiVersion);
  }
}

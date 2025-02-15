import { GithubClient } from "@noutify/functions";
import { env } from "@noutify/env";

export const ghClient = new GithubClient({
  token: env.GITHUB_TOKEN,
});

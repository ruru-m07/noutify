"use server";

import { getGithubClient } from "@/lib/ghClient";
import type { RestEndpointMethodTypes } from "@octokit/plugin-rest-endpoint-methods";

export const createReaction = async (
  content: RestEndpointMethodTypes["reactions"]["createForIssue"]["parameters"]["content"],
  owner: string,
  repo: string,
  number: number
) => {
  const ghClient = await getGithubClient();

  const data = await ghClient.reactions.createForIssue(
    owner,
    repo,
    number,
    content
  );
  if (!data) {
    throw new Error("Failed to create reaction");
  }
  return data;
};

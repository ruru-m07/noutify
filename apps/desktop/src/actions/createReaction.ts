"use server";

import { getGithubClient } from "@/lib/ghClient";
import { log } from "@/lib/logger";
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
    log.error(
      `[createReaction]: Failed to create reaction for issue ${number} in ${owner}/${repo}`
    );
    throw new Error("Failed to create reaction");
  }
  log.info(
    `[createReaction]: Reaction ${content} created for issue ${number} in ${owner}/${repo}`
  );
  return data;
};

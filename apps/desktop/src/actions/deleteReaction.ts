"use server";

import { getGithubClient } from "@/lib/ghClient";
import { log } from "@/lib/logger";

export const deleteReaction = async (
  owner: string,
  repo: string,
  number: number,
  reaction_id: number
) => {
  const ghClient = await getGithubClient();

  const data = await ghClient.reactions.deleteForIssue(
    owner,
    repo,
    number,
    reaction_id
  );

  if (!data) {
    log.error(
      `[deleteReaction]: Failed to delete reaction for issue ${number} in ${owner}/${repo}`
    );
    throw new Error("Failed to delete reaction!");
  }

  log.info(
    `[deleteReaction]: Reaction deleted for issue ${number} in ${owner}/${repo}`
  );
  return data;
};

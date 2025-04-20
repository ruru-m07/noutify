"use server";

import { getGithubClient } from "@/lib/ghClient";

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
    throw new Error("Failed to delete reaction!");
  }

  return data;
};

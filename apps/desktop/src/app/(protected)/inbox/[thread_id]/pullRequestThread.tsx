import { PullRequest } from "@/components/customs/pull";
import { getGithubClient } from "@/lib/ghClient";
import React from "react";

const PullRequestThread = async ({
  user,
  repo,
  pull,
}: {
  user: string;
  repo: string;
  pull: string;
}) => {
  const ghClient = await getGithubClient();

  const pullData = await ghClient.pulls.get(user, repo, Number(pull));
  const reactionData = await ghClient.reactions.listForIssue(
    user,
    repo,
    Number(pull)
  );
  const timeline = await ghClient.pulls.listEvents(user, repo, Number(pull));

  return (
    <PullRequest
      pullRequest={pullData}
      reactionData={reactionData}
      timeline={timeline}
      num={pull}
      repo={repo}
      user={user}
    />
  );
};

export default PullRequestThread;

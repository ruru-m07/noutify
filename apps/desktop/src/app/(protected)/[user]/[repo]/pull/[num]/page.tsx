import React from "react";

import { getGithubClient } from "@/lib/ghClient";

import { PullRequest } from "@/components/customs/pull";

const page = async ({
  params,
}: {
  params: Promise<{ user: string; repo: string; num: string }>;
}) => {
  const { num, repo, user } = await params;
  const ghClient = await getGithubClient();
  const pullData = await ghClient.pulls.get(user, repo, Number(num));
  const reactionData = await ghClient.reactions.listForIssue(
    user,
    repo,
    Number(num)
  );
  const timeline = await ghClient.pulls.listEvents(user, repo, Number(num));

  return (
    <div className="w-full h-full flex flex-col">
      <PullRequest
        pullRequest={pullData}
        reactionData={reactionData}
        timeline={timeline}
        num={num}
        repo={repo}
        user={user}
      />
    </div>
  );
};

export default page;

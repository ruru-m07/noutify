import { PullRequest } from "@/components/customs/pull";
import { getGithubClient } from "@/lib/ghClient";
import React from "react";

const Page = async ({
  params,
}: {
  params: Promise<{ user: string; repo: string; pull: string }>;
}) => {
  const { pull, repo, user } = await params;
  const ghClient = await getGithubClient();
  const pullData = await ghClient.pulls.get(user, repo, Number(pull));
  const reactionData = await ghClient.reactions.listForIssue(
    user,
    repo,
    Number(pull)
  );
  const timeline = await ghClient.pulls.listEvents(user, repo, Number(pull));

  return (
    <div className="w-full h-full flex flex-col">
      <PullRequest
        pullRequest={pullData}
        reactionData={reactionData}
        timeline={timeline}
        num={pull}
        repo={repo}
        user={user}
      />
    </div>
  );
};

export default Page;

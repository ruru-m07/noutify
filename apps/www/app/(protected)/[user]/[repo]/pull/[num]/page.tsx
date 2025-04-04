import { PullRequest } from "@/components/customs/pull";
import { getGithubClient } from "@/lib/ghClient";
import React from "react";

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

  return (
    <div className="w-full h-full flex flex-col">
      <PullRequest
        pullRequest={pullData}
        reactionData={reactionData}
        num={num}
        repo={repo}
        user={user}
      />
    </div>
  );
};

export default page;

import { getGithubClient } from "@/lib/ghClient";
import React from "react";
import PullRequestThread from "./pullRequestThread";

const ThreadPage = async ({
  params,
}: {
  params: Promise<{ thread_id: number }>;
}) => {
  const { thread_id } = await params;

  const ghClient = await getGithubClient();

  const thread = await ghClient.activity.getThread({
    thread_id: thread_id,
  });

  const {
    subject: { type },
  } = thread;

  if (type === "PullRequest") {
    const pullNum = thread.subject.url.split("/").pop();
    return (
      <PullRequestThread
        user={thread.repository.owner.login}
        repo={thread.repository.name}
        pull={pullNum!}
      />
    );
  }

  return (
    <>
      <div>Un implemented thread type: {type}</div>
    </>
  );
};

export default ThreadPage;

/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { getPullRequestIcon } from "@/components/customs/notificationIcon";
import type { RestEndpointMethodTypes } from "@octokit/plugin-rest-endpoint-methods";
import Link from "next/link";

type PullRequestProps = {
  pr: RestEndpointMethodTypes["search"]["issuesAndPullRequests"]["response"]["data"]["items"][];
  repositoryUrl: string;
  number: number;
  title: string;
};

export default function PullRequestItem({
  pr,
  repositoryUrl,
  number,
  title,
}: PullRequestProps) {
  return (
    <Link
      href={`/pulls/${repositoryUrl.replace(
        "https://api.github.com/repos/",
        ""
      )}/${number}`}
      className="relative rounded-md hover:bg-primary-foreground/75 p-4 flex gap-2 cursor-pointer h-[4.5rem]"
      onClick={() => {
        console.log(pr);
      }}
    >
      <div className="w-8 h-8 flex items-center justify-center">
        {getPullRequestIcon(pr as any)}
      </div>

      <div className="text-sm flex flex-col">
        <span className="text-muted-foreground">
          {repositoryUrl.replace("https://api.github.com/repos/", "")}
          {" #" + number}
        </span>
        <p className="truncate w-60">{title}</p>
      </div>
    </Link>
  );
}

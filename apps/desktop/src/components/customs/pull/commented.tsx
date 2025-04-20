import React from "react";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@noutify/ui/components/avatar";
import Link from "next/link";
import { Card } from "@noutify/ui/components/card";
import { Badge } from "@noutify/ui/components/badge";
import Markdown from "@/components/markdown";
import { cn } from "@noutify/ui/lib/utils";

import * as timeago from "timeago.js";
import { getGithubClient } from "@/lib/ghClient";
import Reactions from "../comment/reactions";

export interface CommentedProps {
  repositoryName: string;
  repositoryUser: string;
  threadNumber: string;
  actor: {
    login: string;
    id: number;
    node_id: string;
    avatar_url: string;
    type: "User" | "Bot";
    user_view_type: string;
    site_admin: boolean;
  };
  id: number;
  body: string;
  created_at: string;
  updated_at: string;
  author_association?: string;
}

const Commente = async ({
  repositoryName,
  repositoryUser,
  actor,
  created_at,
  updated_at,
  body,
  threadNumber,
  author_association,
}: CommentedProps) => {
  const ghClient = await getGithubClient();

  const reactionData = await ghClient.reactions.listForIssue(
    repositoryUser,
    repositoryName,
    Number(threadNumber)
  );
  return (
    <div className="flex relative w-full border-none shadow-none rounded-md">
      <div>
        <Avatar
          asChild
          className={cn(actor.type === "Bot" ? "rounded-sm" : "")}
        >
          <Link href={`https://github.com/${actor.login}`}>
            <AvatarImage src={actor.avatar_url} alt={actor.login} />
            <AvatarFallback> </AvatarFallback>
          </Link>
        </Avatar>
      </div>
      <div
        className={`w-full ml-4 comment-triangle after:bg-[#fafafa] before:bg-[#fafafa] after:dark:bg-[#171717] before:dark:bg-[#171717] comment-triangle-action`}
      >
        <Card className={`w-full rounded-md`}>
          <div
            className={cn(
              `border-b p-3 rounded-t-md bg-primary-foreground flex justify-between w-full relative`,
              "after:content-[''] after:absolute after:-left-2 after:top-1/2 after:w-4 after:h-4 after:bg-primary-foreground after:border after:border-border after:-z-10 after:rotate-45 after:transform after:-translate-y-1/2",
              "before:content-[''] before:absolute before:-left-px before:top-1/2 before:w-1 before:h-5 before:bg-primary-foreground before:transform before:-translate-y-1/2"
            )}
          >
            <div className="text-muted-foreground text-sm">
              {actor.login.split("[")[0]}
              {actor.type === "Bot" && (
                <Badge variant={"outline"} className="mx-1">
                  Bot
                </Badge>
              )}
              {""}
              {new Date(created_at).getTime() >
              Date.now() - 7 * 24 * 60 * 60 * 1000
                ? `commented ${timeago.format(updated_at || created_at, "en_US")}`
                : `commented on ${new Date(
                    updated_at || created_at
                  ).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}`}
              {updated_at !== created_at && " • Edited"}
            </div>
            {author_association && author_association !== "NONE" && (
              <div className="flex items-center justify-center gap-2">
                <Badge variant="outline" className="text-muted-foreground">
                  {author_association
                    ? author_association.charAt(0).toUpperCase() +
                      author_association.slice(1).toLowerCase()
                    : "Contributor"}
                </Badge>
              </div>
            )}
          </div>
          <div className="px-4 pt-2">
            {body && (
              <Markdown
                github={`${repositoryUser}/${repositoryName}`}
                markdown={body}
              />
            )}
          </div>
          <Reactions
            repoUser={repositoryUser}
            repoName={repositoryName}
            pullRequestNumber={threadNumber}
            reactionData={reactionData}
          />
        </Card>
      </div>
    </div>
  );
};

export default Commente;

/* eslint-disable @next/next/no-img-element */
import React from "react";
import { Smile } from "lucide-react";

import type { RestEndpointMethodTypes } from "@octokit/plugin-rest-endpoint-methods";

import { groupedReactions, isMyReaction } from "@/lib/groupedReactions";

import { Button } from "@noutify/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@noutify/ui/components/dropdown-menu";

import { auth } from "@/auth";

import { ClientReactionButton } from "./client-reaction-button";
import { ReactionProvider } from "./client-reaction-context";

interface ReactionsProps {
  reactionData:
    | RestEndpointMethodTypes["reactions"]["listForIssue"]["response"]["data"]
    | null;
  repoUser: string;
  repoName: string;
  pullRequestNumber: string;
}

const Reactions = async ({
  reactionData,
  pullRequestNumber,
  repoName,
  repoUser,
}: ReactionsProps) => {
  const pullRequestReactions = reactionData
    ? groupedReactions(reactionData)
    : [];

  const session = await auth();

  if (!reactionData) {
    return null;
  }

  return (
    <div className="px-4 mt-6 mb-2 flex items-center">
      <ReactionProvider
        initialReactions={reactionData}
        loginUser={session?.user.profile.login}
      >
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              size="icon"
              className="rounded-full m-0 px-2 size-7 mr-2"
              variant="outline"
              aria-label="Open account menu"
            >
              <Smile size={16} aria-hidden="true" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="max-w-64">
            <ClientReactionButton
              content="heart"
              count={0}
              users={[]}
              isMyReaction={false}
              repoUser={repoUser}
              repoName={repoName}
              pullRequestNumber={Number(pullRequestNumber)}
              reactionData={reactionData}
              loginUser={session?.user.profile.login}
              variant="icon"
            />
          </DropdownMenuContent>
        </DropdownMenu>
        {pullRequestReactions.map((reaction) => (
          <ClientReactionButton
            key={reaction.content}
            content={reaction.content}
            count={reaction.count}
            users={reaction.users}
            isMyReaction={
              !!reactionData &&
              isMyReaction(
                reactionData,
                reaction.content,
                session?.user.profile.login
              )
            }
            repoUser={repoUser}
            repoName={repoName}
            pullRequestNumber={Number(pullRequestNumber)}
            reactionData={reactionData}
            loginUser={session?.user.profile.login}
          />
        ))}
      </ReactionProvider>
    </div>
  );
};

export default Reactions;

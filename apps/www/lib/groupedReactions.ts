import type { RestEndpointMethodTypes } from "@octokit/plugin-rest-endpoint-methods";
import { useMemo } from "react";

const reactionOrder = {
  "+1": 1,
  "-1": 2,
  laugh: 3,
  hooray: 4,
  confused: 5,
  heart: 6,
  rocket: 7,
  eyes: 8,
} as const;

export type GroupedReaction = {
  content: keyof typeof reactionOrder;
  count: number;
  users: Array<{
    id: number;
    login: string;
    avatar_url: string;
  }>;
  reactionId: number;  
};

export const groupedReactions = (
  reactionData: RestEndpointMethodTypes["reactions"]["listForIssue"]["response"]["data"]
) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  return useMemo<GroupedReaction[]>(() => {
    if (!reactionData) return [];

    const reactionMap: Record<string, GroupedReaction> = {};

    reactionData.forEach((reaction) => {
      if (!reaction || !reaction.user) {
        return;
      }

      if (!reactionMap[reaction.content]) {
        reactionMap[reaction.content] = {
          content: reaction.content as keyof typeof reactionOrder,
          count: 0,
          users: [],
          reactionId: reaction.id,  
        };
      }

      reactionMap[reaction.content]!.count += 1;
      reactionMap[reaction.content]!.users.push({
        id: reaction.user.id,
        login: reaction.user.login,
        avatar_url: reaction.user.avatar_url,
      });
    });

    return Object.values(reactionMap).sort((a, b) => {
      const orderA = reactionOrder[a.content] || 999;
      const orderB = reactionOrder[b.content] || 999;
      return orderA - orderB;
    });
  }, [reactionData]);
};

export const isMyReaction = (
  reactionData: RestEndpointMethodTypes["reactions"]["listForIssue"]["response"]["data"],
  content: RestEndpointMethodTypes["reactions"]["createForIssue"]["parameters"]["content"],
  myLogin: string
) => {
  if (!reactionData || !myLogin) return false;

  return reactionData.some(
    (reaction) =>
      reaction &&
      reaction.user &&
      reaction.user.login === myLogin &&
      reaction.content === content
  );
};

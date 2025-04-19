"use client";

import type { ReactNode } from "react";
import React, { createContext, useContext, useState } from "react";
import type { RestEndpointMethodTypes } from "@octokit/plugin-rest-endpoint-methods";

type ReactionType =
  | "+1"
  | "-1"
  | "laugh"
  | "eyes"
  | "heart"
  | "hooray"
  | "confused"
  | "rocket";

interface ReactionState {
  [key: string]: {
    isMyReaction: boolean;
    reactionId?: number;
  };
}

interface ReactionContextType {
  reactions: ReactionState;
  toggleReaction: (content: ReactionType, reactionId?: number) => void;
}

const ReactionContext = createContext<ReactionContextType | undefined>(
  undefined
);

export function ReactionProvider({
  children,
  initialReactions,
  loginUser,
}: {
  children: ReactNode;
  initialReactions: RestEndpointMethodTypes["reactions"]["listForIssue"]["response"]["data"];
  loginUser: string;
}) {
  // Initialize reaction state from the initial data
  const initialState: ReactionState = {};

  // Set up initial reaction states
  const reactionsSet: ReactionType[] = [
    "+1",
    "-1",
    "laugh",
    "eyes",
    "heart",
    "hooray",
    "confused",
    "rocket",
  ];

  reactionsSet.forEach((content) => {
    const userReaction = initialReactions.find(
      (reaction) =>
        reaction.content === content && reaction.user?.login === loginUser
    );

    initialState[content] = {
      isMyReaction: !!userReaction,
      reactionId: userReaction?.id,
    };
  });

  const [reactions, setReactions] = useState<ReactionState>(initialState);

  const toggleReaction = (content: ReactionType, reactionId?: number) => {
    setReactions((prev) => ({
      ...prev,
      [content]: {
        isMyReaction: !prev[content]?.isMyReaction,
        reactionId: reactionId || prev[content]?.reactionId,
      },
    }));
  };

  return (
    <ReactionContext.Provider value={{ reactions, toggleReaction }}>
      {children}
    </ReactionContext.Provider>
  );
}

export function useReaction() {
  const context = useContext(ReactionContext);
  if (context === undefined) {
    throw new Error("useReaction must be used within a ReactionProvider");
  }
  return context;
}

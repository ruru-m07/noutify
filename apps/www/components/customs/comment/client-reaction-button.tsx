"use client"

import React from "react"
import type { RestEndpointMethodTypes } from "@octokit/plugin-rest-endpoint-methods"
import { createReaction } from "@/actions/createReaction"
import { deleteReaction } from "@/actions/deleteReaction"
import { Button } from "@noutify/ui/components/button"
import { cn } from "@noutify/ui/lib/utils"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@noutify/ui/components/tooltip"
import { useReaction } from "./client-reaction-context"

interface ClientReactionButtonProps {
  content: string
  count: number
  users: Array<{ id: number; login: string; avatar_url: string }>
  isMyReaction: boolean
  repoUser: string
  repoName: string
  pullRequestNumber: number
  reactionData: RestEndpointMethodTypes["reactions"]["listForIssue"]["response"]["data"]
  loginUser: string
  variant?: "default" | "icon"
}

const reactionsSet = [
  { icon: "👍", label: "+1" },
  { icon: "👎", label: "-1" },
  { icon: "😄", label: "laugh" },
  { icon: "👀", label: "eyes" },
  { icon: "❤️", label: "heart" },
  { icon: "🎉", label: "hooray" },
  { icon: "😕", label: "confused" },
  { icon: "🚀", label: "rocket" },
]

export function ClientReactionButton({
  content,
  count,
  users,
  isMyReaction: initialIsMyReaction,
  repoUser,
  repoName,
  pullRequestNumber,
  reactionData,
  loginUser,
  variant = "default",
}: ClientReactionButtonProps) {
  const [isDisabled, setIsDisabled] = React.useState(false)
  const { reactions, toggleReaction } = useReaction()

  // ?  Use the shared state from context instead of local state
  const isMyReactionState = reactions[content]?.isMyReaction ?? initialIsMyReaction

  const reactionId =
    reactions[content]?.reactionId ??
    (reactionData.find((reaction) => reaction.content === content && reaction.user?.login === loginUser)?.id as number)

  const handleReactionClick = async (reactionContent = content) => {
    setIsDisabled(true)
    try {
      // Get the current reaction state and ID for the specific reaction content
      const isCurrentReaction =
        reactions[reactionContent]?.isMyReaction ??
        !!reactionData.find((reaction) => reaction.content === reactionContent && reaction.user?.login === loginUser)

      const currentReactionId =
        reactions[reactionContent]?.reactionId ??
        (reactionData.find((reaction) => reaction.content === reactionContent && reaction.user?.login === loginUser)
          ?.id as number)

      if (isCurrentReaction) {
        // Use the correct reaction ID for deletion
        await deleteReaction(repoUser, repoName, pullRequestNumber, currentReactionId)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        toggleReaction(reactionContent as any)
      } else {
        const data = await createReaction(
          reactionContent as RestEndpointMethodTypes["reactions"]["createForIssue"]["parameters"]["content"],
          repoUser,
          repoName,
          pullRequestNumber,
        )
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        toggleReaction(reactionContent as any, data.id)
      }
    } catch (error) {
      console.error("Error handling reaction:", error)
    } finally {
      setIsDisabled(false)
    }
  }

  if (variant === "icon") {
    return (
      <div className="grid grid-cols-4 gap-1">
        {reactionsSet.map((reaction, i) => (
          <TooltipProvider key={i} delayDuration={1000}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  className={cn(
                    reactions[reaction.label]?.isMyReaction &&
                      "bg-green-700/20 hover:bg-green-700/35 border-green-700/45 border",
                  )}
                  variant={"ghost"}
                  size={"icon"}
                  disabled={isDisabled}
                  onClick={() => handleReactionClick(reaction.label)}
                >
                  {reaction.icon}
                </Button>
              </TooltipTrigger>
              <TooltipContent className="dark px-2 py-1 text-xs">{reaction.label}</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ))}
      </div>
    )
  }

  return (
    <Button
      variant={isMyReactionState ? "secondary" : "outline"}
      size={"sm"}
      className={cn(
        "text-muted-foreground space-x-2 mr-2 px-1.5 py-0 h-7 rounded-full items-center flex justify-between",
        isMyReactionState && "bg-green-700/20 hover:bg-green-700/35 border-green-700/45 border",
      )}
      disabled={isDisabled}
      onClick={() => handleReactionClick()}
    >
      <span>
        {{
          "+1": "👍",
          "-1": "👎",
          laugh: "😄",
          eyes: "👀",
          heart: "❤️",
          hooray: "🎉",
          confused: "😕",
          rocket: "🚀",
        }[content] || content}
      </span>
      <span>{count}</span>
      <div className="flex items-center -space-x-1">
        {users.slice(0, 4).map((user) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={user.id}
            className="ring-background rounded-full ring-1 size-4"
            src={user.avatar_url || "/placeholder.svg"}
            width={20}
            height={20}
            alt={user.login}
          />
        ))}
      </div>
    </Button>
  )
}


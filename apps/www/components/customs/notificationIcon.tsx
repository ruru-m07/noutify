import React from "react";

import type { Notification } from "@/context/appState";
import {
  GitCommitVertical,
  GitMerge,
  GitPullRequestArrow,
  GitPullRequestClosed,
  GitPullRequestDraft,
  X,
  CircleDot,
  CircleCheck,
  CircleSlash,
  MessagesSquare,
  Tag,
} from "lucide-react";

interface NotificationIconProps {
  notification: Notification;
}

const NotificationIcon = ({ notification }: NotificationIconProps) => {
  const getIssueIcon = () => {
    if (notification.issue?.state === "open") {
      return (
        <CircleDot className="text-green-500" size={20} strokeWidth={1.5} />
      );
    } else if (notification.issue?.state === "closed") {
      if (
        notification.issue.state_reason === "not_planned" ||
        // @ts-expect-error - state_reason is not in the type
        notification.issue.state_reason === "duplicate"
      ) {
        return (
          <CircleSlash className="text-gray-400" size={20} strokeWidth={1.5} />
        );
      } else {
        return (
          <CircleCheck
            className="text-purple-500"
            size={20}
            strokeWidth={1.5}
          />
        );
      }
    }
    return null;
  };

  const getPullRequestIcon = () => {
    if (notification.pullRequest?.merged) {
      return (
        <GitMerge className="text-purple-500" size={20} strokeWidth={1.5} />
      );
    }
    if (notification.pullRequest?.draft) {
      return (
        <GitPullRequestDraft
          className="text-gray-400"
          size={20}
          strokeWidth={1.5}
        />
      );
    }
    if (
      !notification.pullRequest?.merged &&
      notification.pullRequest?.state === "closed"
    ) {
      return (
        <GitPullRequestClosed
          className="text-red-500"
          size={20}
          strokeWidth={1.5}
        />
      );
    }
    if (notification.subject.type === "PullRequest") {
      return (
        <GitPullRequestArrow
          className="text-green-500"
          size={20}
          strokeWidth={1.5}
        />
      );
    }
    return null;
  };

  const getCheckSuiteIcon = () => {
    return <X className="text-red-500" size={20} strokeWidth={1.5} />;
  };

  return (
    <div className="w-8 h-8 flex items-center justify-center">
      {notification.subject.type === "PullRequest" && getPullRequestIcon()}
      {notification.subject.type === "Issue" && getIssueIcon()}
      {notification.subject.type === "CheckSuite" && getCheckSuiteIcon()}
      {notification.subject.type === "Commit" && (
        <GitCommitVertical
          className="text-muted-foreground"
          size={30}
          strokeWidth={1.2}
        />
      )}
      {notification.subject.type === "Discussion" && (
        <MessagesSquare className="text-gray-400" size={20} strokeWidth={1.5} />
      )}
      {notification.subject.type === "Release" && (
        <Tag className="text-gray-400" size={19} strokeWidth={1.5} />
      )}
    </div>
  );
};

export default NotificationIcon;

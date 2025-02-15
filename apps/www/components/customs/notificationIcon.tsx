import React from "react";

import type { Notification } from "@/context/appState";
import {
  GitCommitVertical,
  GitMerge,
  GitPullRequestArrow,
  GitPullRequestClosed,
  GitPullRequestDraft,
  X,
} from "lucide-react";

interface NotificationIconProps {
  notification: Notification;
}

const NotificationIcon = ({ notification }: NotificationIconProps) => {
  return (
    <div className="w-8 h-8 flex items-center justify-center">
      {notification.subject.type === "PullRequest" &&
      notification.pullRequest?.merged ? (
        <GitMerge className="text-purple-500" size={20} strokeWidth={1.5} />
      ) : notification.pullRequest?.draft ? (
        <GitPullRequestDraft
          className="text-gray-400"
          size={20}
          strokeWidth={1.5}
        />
      ) : !notification.pullRequest?.merged &&
        notification.pullRequest?.state === "closed" ? (
        <GitPullRequestClosed
          className="text-red-500"
          size={20}
          strokeWidth={1.5}
        />
      ) : (
        notification.subject.type === "PullRequest" && (
          <GitPullRequestArrow
            className="text-green-500"
            size={20}
            strokeWidth={1.5}
          />
        )
      )}

      {notification.subject.type === "Commit" && (
        <GitCommitVertical
          className="text-muted-foreground"
          size={24}
          strokeWidth={1.5}
        />
      )}
      {notification.subject.type === "CheckSuite" && (
        <X className="text-red-500" size={20} strokeWidth={1.5} />
      )}
    </div>
  );
};

export default NotificationIcon;

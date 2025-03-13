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
  TriangleAlert,
} from "lucide-react";
import type { RestEndpointMethodTypes } from "@octokit/plugin-rest-endpoint-methods";

interface NotificationIconProps {
  notification: Notification;
}

export const getIssueIcon = (
  issue: RestEndpointMethodTypes["issues"]["get"]["response"]["data"]
) => {
  if (issue?.state === "open") {
    return <CircleDot className="text-green-500" size={20} strokeWidth={1.5} />;
  } else if (issue?.state === "closed") {
    if (
      issue.state_reason === "not_planned" ||
      // @ts-expect-error - state_reason is not in the type
      issue.state_reason === "duplicate"
    ) {
      return (
        <CircleSlash className="text-gray-400" size={20} strokeWidth={1.5} />
      );
    } else {
      return (
        <CircleCheck className="text-purple-500" size={20} strokeWidth={1.5} />
      );
    }
  }
  return null;
};

export const getPullRequestIcon = (
  pullRequest: RestEndpointMethodTypes["pulls"]["get"]["response"]["data"]
) => {
  if (pullRequest?.merged) {
    return <GitMerge className="text-purple-500" size={20} strokeWidth={1.5} />;
  }
  if (pullRequest?.draft) {
    return (
      <GitPullRequestDraft
        className="text-gray-400"
        size={20}
        strokeWidth={1.5}
      />
    );
  }
  if (!pullRequest?.merged && pullRequest?.state === "closed") {
    return (
      <GitPullRequestClosed
        className="text-red-500"
        size={20}
        strokeWidth={1.5}
      />
    );
  }
  if (pullRequest?.state === "open") {
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

const NotificationIcon = ({ notification }: NotificationIconProps) => {
  return (
    <div className="w-8 h-8 flex items-center justify-center">
      {notification.pullRequest &&
        notification.subject.type === "PullRequest" &&
        getPullRequestIcon(notification.pullRequest)}
      {notification.issue &&
        notification.subject.type === "Issue" &&
        getIssueIcon(notification.issue)}
      {notification.subject.type === "CheckSuite" && (
        <X className="text-red-500" size={20} strokeWidth={1.5} />
      )}
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
      {notification.subject.type === "RepositoryDependabotAlertsThread" && (
        <TriangleAlert className="text-gray-400" size={19} strokeWidth={1.5} />
      )}

      {/* // TODO: RepositoryInvitation */}
    </div>
  );
};

export default NotificationIcon;

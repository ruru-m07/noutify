"use client";

import { getAuthenticatedUser, listNotifications } from "@/actions/gh";
import type { RestEndpointMethodTypes } from "@octokit/plugin-rest-endpoint-methods";
import React, {
  createContext,
  useLayoutEffect,
  useState,
  type ReactNode,
} from "react";
import { useSession } from "next-auth/react";
import { db } from "@/lib/db";

export type BaseNotification =
  RestEndpointMethodTypes["activity"]["listNotificationsForAuthenticatedUser"]["response"]["data"][0];

export interface Notification extends BaseNotification {
  pullRequest?: RestEndpointMethodTypes["pulls"]["get"]["response"]["data"];
  issue?: RestEndpointMethodTypes["issues"]["get"]["response"]["data"];
}

export type User =
  RestEndpointMethodTypes["users"]["getAuthenticated"]["response"]["data"];

export type FilterState = {
  all: false;
  read: true;
};

interface AppStateContextType {
  notifications: Notification[];
  selectedNotification?: Notification | null;
  setSelectedNotification: React.Dispatch<
    React.SetStateAction<Notification | null>
  >;
  user: User | null;
  isNotificationsLoading: boolean;
  filter: FilterState;
  setFilter: React.Dispatch<React.SetStateAction<FilterState>>;
  setNotifications: React.Dispatch<React.SetStateAction<Notification[]>>;
}

export const AppStateContext = createContext<AppStateContextType | undefined>(
  undefined
);

export const AppStateProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  // ! Is Notification Loading
  const [isNotificationsLoading, setIsNotificationsLoading] =
    useState<boolean>(true);

  // ! All centralized states
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useLayoutEffect(() => {
    const startTime = performance.now();
    db.notifications.get("1").then((gotCached) => {
      if (gotCached) {
        console.log("cache hit!", gotCached.data.length);
        setNotifications(JSON.parse(gotCached.data));
        setIsNotificationsLoading(false);
      }
      console.log(`Time taken: ${performance.now() - startTime} ms`);
    });
  }, []);

  // ! Selected notification
  const [selectedNotification, setSelectedNotification] =
    useState<Notification | null>(null);

  // ! user state
  const [user, setUser] = useState<User | null>(null);
  const { data: session } = useSession();

  // ! Notification Filter Stat. ( all in one )
  const [filter, setFilter] = useState<FilterState>({
    all: false,
    read: true,
  });

  useLayoutEffect(() => {
    // ! Fetch notifications
    (async () => {
      if (!session || !session.user.accessToken) {
        return;
      }

      const startTime = performance.now();

      const [notificationsList, activeUser] = await Promise.all([
        listNotifications({
          all: filter.all,
          read: filter.read,
        }),
        getAuthenticatedUser(),
      ]);

      const endTime = performance.now();

      setUser(activeUser);
      setNotifications(notificationsList);
      setIsNotificationsLoading(false);

      console.log(
        `Time taken to fetch notifications: ${endTime - startTime} ms`
      );

      // db.notifications.bulkPut(notificationsList);
      db.notifications.put({
        id: "1",
        data: JSON.stringify(parseNotificationData(notificationsList)),
      });
    })();
  }, [filter.all, filter.read, session]);

  return (
    <AppStateContext.Provider
      value={{
        notifications,
        selectedNotification,
        setSelectedNotification,
        user,
        isNotificationsLoading,
        setFilter,
        filter,
        setNotifications,
      }}
    >
      {children}
    </AppStateContext.Provider>
  );
};

export type { AppStateContextType };

function parseNotificationData(data: Notification[]) {
  // ! In this Function we have the array of notifications
  // ! We can parse the data here and return the parsed data.
  // ! we want have each notification with the large unused data
  // ! we return only the required data. to make it light weight.

  const parsedData = data.map((notification) => {
    return {
      id: notification.id,
      unread: notification.unread,
      reason: notification.reason,
      updated_at: notification.updated_at,
      last_read_at: notification.last_read_at,
      subject: {
        title: notification.subject.title,
        url: notification.subject.url,
        latest_comment_url: notification.subject.latest_comment_url,
        type: notification.subject.type,
      },
      repository: {
        id: notification.repository.id,
        node_id: notification.repository.node_id,
        name: notification.repository.name,
        full_name: notification.repository.full_name,
        private: notification.repository.private,
        owner: {
          login: notification.repository.owner.login,
          id: notification.repository.owner.id,
        },
      },
      pullRequest: notification.pullRequest
        ? parseNotificationPullRequest(notification.pullRequest)
        : null,
      issue: notification.issue
        ? parseNotificationIssue(notification.issue)
        : null,
    };
  });

  return parsedData;
}

function parseNotificationPullRequest(data: Notification["pullRequest"]) {
  if (!data) {
    return null;
  }
  return {
    id: data.id,
    node_id: data.node_id,
    number: data.number,
    state: data.state,
    locked: data.locked,
    title: data.title,
    body: data.body,
    created_at: data.created_at,
    updated_at: data.updated_at,
    closed_at: data.closed_at,
    merged_at: data.merged_at,
    merge_commit_sha: data.merge_commit_sha,
    assignee: {
      login: data.assignee?.login,
      id: data.assignee?.id,
      node_id: data.assignee?.node_id,
      avatar_url: data.assignee?.avatar_url,
      type: data.assignee?.type,
      user_view_type: data.assignee?.user_view_type,
      site_admin: data.assignee?.site_admin,
    },
    assignees: data.assignees?.map((assignee) => {
      return {
        login: assignee.login,
        id: assignee.id,
        node_id: assignee.node_id,
        avatar_url: assignee.avatar_url,
        type: assignee.type,
        user_view_type: assignee.user_view_type,
        site_admin: assignee.site_admin,
      };
    }),
    requested_reviewers: data.requested_reviewers?.map((reviewer) => {
      return {
        login: reviewer.login,
        id: reviewer.id,
        node_id: reviewer.node_id,
        avatar_url: reviewer.avatar_url,
        type: reviewer.type,
        user_view_type: reviewer.user_view_type,
        site_admin: reviewer.site_admin,
      };
    }),
    requested_teams: data.requested_teams,
    labels: data.labels.map((label) => {
      return {
        id: label.id,
        node_id: label.node_id,
        name: label.name,
        color: label.color,
        default: label.default,
        description: label.description,
      };
    }),
    milestone: data.milestone,
    draft: data.draft,
    head: {
      label: data.head.label,
      ref: data.head.ref,
      sha: data.head.sha,
      user: {
        login: data.head.user.login,
        id: data.head.user.id,
        node_id: data.head.user.node_id,
        avatar_url: data.head.user.avatar_url,
        type: data.head.user.type,
        user_view_type: data.head.user.user_view_type,
        site_admin: data.head.user.site_admin,
      },
      repo: {
        id: data.head.repo.id,
        node_id: data.head.repo.node_id,
        name: data.head.repo.name,
        full_name: data.head.repo.full_name,
        private: data.head.repo.private,
        owner: {
          login: data.head.repo.owner.login,
          id: data.head.repo.owner.id,
          node_id: data.head.repo.owner.node_id,
          avatar_url: data.head.repo.owner.avatar_url,
          type: data.head.repo.owner.type,
          user_view_type: data.head.repo.owner.user_view_type,
          site_admin: data.head.repo.owner.site_admin,
        },
        description: data.head.repo.description,
        fork: data.head.repo.fork,
        created_at: data.head.repo.created_at,
        updated_at: data.head.repo.updated_at,
        pushed_at: data.head.repo.pushed_at,
        git_url: data.head.repo.git_url,
        ssh_url: data.head.repo.ssh_url,
        clone_url: data.head.repo.clone_url,
        svn_url: data.head.repo.svn_url,
        homepage: data.head.repo.homepage,
        size: data.head.repo.size,
        stargazers_count: data.head.repo.stargazers_count,
        watchers_count: data.head.repo.watchers_count,
      },
    },
    base: {
      label: data.base.label,
      ref: data.base.ref,
      sha: data.base.sha,
      user: {
        login: data.base.user.login,
        id: data.base.user.id,
        node_id: data.base.user.node_id,
        avatar_url: data.base.user.avatar_url,
        type: data.base.user.type,
        user_view_type: data.base.user.user_view_type,
        site_admin: data.base.user.site_admin,
      },
      repo: {
        id: data.base.repo.id,
        node_id: data.base.repo.node_id,
        name: data.base.repo.name,
        full_name: data.base.repo.full_name,
        private: data.base.repo.private,
        owner: {
          login: data.base.repo.owner.login,
          id: data.base.repo.owner.id,
          node_id: data.base.repo.owner.node_id,
          avatar_url: data.base.repo.owner.avatar_url,
          type: data.base.repo.owner.type,
          user_view_type: data.base.repo.owner.user_view_type,
          site_admin: data.base.repo.owner.site_admin,
        },
        html_url: data.base.repo.html_url,
        description: data.base.repo.description,
        fork: data.base.repo.fork,
        created_at: data.base.repo.created_at,
        updated_at: data.base.repo.updated_at,
        pushed_at: data.base.repo.pushed_at,
        git_url: data.base.repo.git_url,
        ssh_url: data.base.repo.ssh_url,
        clone_url: data.base.repo.clone_url,
        svn_url: data.base.repo.svn_url,
        homepage: data.base.repo.homepage,
        size: data.base.repo.size,
        stargazers_count: data.base.repo.stargazers_count,
        watchers_count: data.base.repo.watchers_count,
      },
    },
    author_association: data.author_association,
    auto_merge: data.auto_merge,
    active_lock_reason: data.active_lock_reason,
    merged: data.merged,
    mergeable: data.mergeable,
    rebaseable: data.rebaseable,
    mergeable_state: data.mergeable_state,
    merged_by: {
      login: data.merged_by?.login,
      id: data.merged_by?.id,
      node_id: data.merged_by?.node_id,
      avatar_url: data.merged_by?.avatar_url,
      type: data.merged_by?.type,
      user_view_type: data.merged_by?.user_view_type,
      site_admin: data.merged_by?.site_admin,
    },
    comments: data.comments,
    review_comments: data.review_comments,
    maintainer_can_modify: data.maintainer_can_modify,
    commits: data.commits,
    additions: data.additions,
    deletions: data.deletions,
    changed_files: data.changed_files,
  };
}

function parseNotificationIssue(data: Notification["issue"]) {
  if (!data) {
    return null;
  }

  return {
    id: data.id,
    node_id: data.node_id,
    number: data.number,
    title: data.title,
    user: {
      login: data.user?.login,
      id: data.user?.id,
      node_id: data.user?.node_id,
      avatar_url: data.user?.avatar_url,
      type: data.user?.type,
      user_view_type: data.user?.user_view_type,
      site_admin: data.user?.site_admin,
    },
    state: data.state,
    locked: data.locked,
    assignee: data.assignee,
    assignees: data.assignees,
    milestone: data.milestone,
    comments: data.comments,
    created_at: data.created_at,
    updated_at: data.updated_at,
    closed_at: data.closed_at,
    author_association: data.author_association,
    sub_issues_summary: {
      total: data.sub_issues_summary?.total,
      completed: data.sub_issues_summary?.completed,
      percent_completed: data.sub_issues_summary?.percent_completed,
    },
    active_lock_reason: data.active_lock_reason,
    body: data.body,
    closed_by: data.closed_by,
    reactions: {
      total_count: data.reactions?.total_count,
      "+1": data.reactions && data.reactions["+1"],
      "-1": data.reactions && data.reactions["-1"],
      laugh: data.reactions?.laugh,
      hooray: data.reactions?.hooray,
      confused: data.reactions?.confused,
      heart: data.reactions?.heart,
      rocket: data.reactions?.rocket,
      eyes: data.reactions?.eyes,
    },
    performed_via_github_app: data.performed_via_github_app,
    state_reason: data.state_reason,
  };
}

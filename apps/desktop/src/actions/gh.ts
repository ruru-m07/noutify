"use server";

import type { Notification } from "@/types";
import { getGithubClient } from "@/lib/ghClient";
import { log } from "@/lib/logger";

export async function listNotifications({
  all,
  read,
}: {
  all?: boolean;
  read?: boolean;
}): Promise<Notification[]> {
  log.debug(
    `[listNotifications]: Fetching notifications with all: ${all}, read: ${read}`
  );
  const ghClient = await getGithubClient();

  const notifications = await ghClient.activity.listNotifications({
    // all: false,
    // read: true,
    // page: 1,
    per_page: 20,
    all,
    read,
  });

  const pullRequestNotifications = notifications.filter(
    (notification) => notification.subject.type === "PullRequest"
  );
  const issueNotifications = notifications.filter(
    (notification) => notification.subject.type === "Issue"
  );

  const pullRequestPromises = pullRequestNotifications.map((notification) =>
    ghClient.pulls.get(
      notification.repository.owner.login,
      notification.repository.name,
      Number(notification.subject.url.split("/").pop()) || 1
    )
  );

  const issuePromises = issueNotifications.map((notification) =>
    ghClient.issues.get(
      notification.repository.owner.login,
      notification.repository.name,
      Number(notification.subject.url.split("/").pop()) || 1
    )
  );

  const pullRequests = await Promise.all(pullRequestPromises);
  const issues = await Promise.all(issuePromises);

  const prStatuses = notifications.map((notification) => {
    const prIndex = pullRequestNotifications.findIndex(
      (prNotification) => prNotification.id === notification.id
    );
    if (prIndex !== -1) {
      log.info(
        `[listNotifications]: Pull request notification found for ${notification.subject.title}`
      );
      return {
        ...notification,
        pullRequest: pullRequests[prIndex],
      };
    }

    const issueIndex = issueNotifications.findIndex(
      (issueNotification) => issueNotification.id === notification.id
    );
    if (issueIndex !== -1) {
      log.info(
        `[listNotifications]: Issue notification found for ${notification.subject.title}`
      );
      return {
        ...notification,
        issue: issues[issueIndex],
      };
    }

    log.info(
      `[listNotifications]: Notification found for ${notification.subject.title}`
    );
    return notification;
  });

  log.info(
    `[listNotifications]: ${prStatuses.length} notifications fetched successfully`
  );
  return prStatuses;
}

export async function getAuthenticatedUser() {
  const ghClient = await getGithubClient();

  if (!ghClient) {
    log.error("GitHub client is not initialized");
    throw new Error("GitHub client is not initialized");
  }
  log.info("Authenticated user fetched successfully");
  return await ghClient.users.getAuthenticatedUser();
}

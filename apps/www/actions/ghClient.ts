"use server";

import { ghClient } from "@/lib/ghClient";
import type { Notification } from "@/context/appState";

export async function listNotifications(): Promise<Notification[]> {
  const notifications = await ghClient.activity.listNotifications({
    all: true,
    read: false,
    page: 1,
    per_page: 30,
  });

  const prStatuses = await Promise.all(
    notifications.map(async (notification) => {
      if (notification.subject.type === "PullRequest") {
        const pullRequest = await ghClient.pulls.get(
          notification.repository.owner.login,
          notification.repository.name,
          Number(notification.subject.url.split("/").pop()) || 1
        );
        return {
          ...notification,
          pullRequest,
        };
      }
      return notification;
    })
  );

  return prStatuses;
}

export async function getAuthenticatedUser() {
  return await ghClient.users.getAuthenticatedUser();
}

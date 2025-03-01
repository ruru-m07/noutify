import React from "react";

import type { Notification } from "@/context/appState";

export const Conversation = ({
  notification,
}: {
  notification: Notification;
}) => {
  return <div>{notification.pullRequest?.body}</div>;
};

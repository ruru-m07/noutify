import type { Notification } from "@/types";
import React from "react";

export const Conversation = ({
  notification,
}: {
  notification: Notification;
}) => {
  return <div>{notification.pullRequest?.body}</div>;
};

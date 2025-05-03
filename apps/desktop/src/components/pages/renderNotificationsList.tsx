import React from "react";
import NotificationIcon from "../customs/notificationIcon";
import type { Notification } from "@/types";
import Link from "next/link";

const RenderNotificationsList = ({
  notification,
}: {
  notification: Notification;
}) => {
  return (
    <Link
      href={`/inbox/${notification.id}`}
      className="relative rounded-md hover:bg-primary-foreground/75 p-4 flex gap-2 cursor-pointer h-[4.5rem]"
      prefetch={true}
    >
      {notification.unread ? (
        <div className="absolute top-1/2 right-5 -translate-x-1/2 -translate-y-1/2 size-2 bg-primary rounded-full" />
      ) : null}

      <NotificationIcon notification={notification} />

      <div className="text-sm flex flex-col">
        <span className="text-muted-foreground">
          {notification.repository.full_name}
          {notification.subject.type === "PullRequest" &&
            " #" + notification.subject.url.split("/").pop()}
        </span>
        <p className="truncate w-60">{notification.subject.title}</p>
      </div>
    </Link>
  );
};

export default RenderNotificationsList;

import React from "react";

import type { Notification } from "@/context/appState";
import NotificationIcon from "../customs/notificationIcon";
import { Button } from "@noutify/ui/components/button";
import Link from "next/link";
import PullRequestThread from "./PullRequest";

interface ThreadProps {
  notification: Notification;
}

const Thread = ({ notification }: ThreadProps) => {
  return (
    <>
      <div className="h-[var(--top-nav-height)] border-b px-4 w-full flex items-center justify-between">
        <div className="flex gap-2 items-center">
          <NotificationIcon notification={notification} />
          <span className="truncate w-[40rem]">
            {notification.subject.title}
          </span>
        </div>
        <div className="gap-2 flex items-center">
          <div className="text-muted-foreground transition-all">
            <Link
              className="hover:underline hover:text-primary"
              href={notification.repository.owner.html_url}
              target="_blank"
            >
              {notification.repository.owner.login}
            </Link>
            {" / "}
            <Link
              className="hover:underline hover:text-primary"
              href={`${notification.repository.owner.html_url}/${notification.repository.name}`}
              target="_blank"
            >
              {notification.repository.name}
            </Link>
          </div>

          {notification.subject.type === "PullRequest" && (
            <Link
              target="_blank"
              href={notification.pullRequest?.html_url || ""}
            >
              <Button variant={"ghost"} size={"sm"} className="text-sm">
                {notification.subject.type === "PullRequest" &&
                  " #" + notification.subject.url.split("/").pop()}
              </Button>
            </Link>
          )}
        </div>
      </div>
      <div className="flex justify-center w-full h-full">
        <div className="w-10/12 h-full">
          {notification.subject.type === "PullRequest" && (
            <PullRequestThread notification={notification} />
          )}
        </div>
      </div>
    </>
  );
};

export default Thread;

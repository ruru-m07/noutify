import React from "react";

import type { Notification } from "@/context/appState";
import { H4, Muted } from "../typography";
import {
  ArrowRight,
  FilePlus,
  GitCommit,
  ListCheck,
  MessagesSquare,
  MoveRight,
} from "lucide-react";
import Link from "next/link";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@noutify/ui/components/tabs";
import { Badge } from "@noutify/ui/components/badge";
import { Conversation } from "./Conversation";

interface ThreadProps {
  notification: Notification;
}
const PullRequestThread = ({ notification }: ThreadProps) => {
  console.log({
    notification,
  });
  return (
    <div className="mt-10">
      <div>
        <H4>{notification.subject.title}</H4>
        <Muted className="flex items-center gap-2">
          {notification.pullRequest?.head.label &&
          notification.pullRequest?.base.label &&
          notification.pullRequest?.head.label.startsWith(
            notification.pullRequest?.base.label.split(":")[0] || ""
          ) &&
          notification.pullRequest?.base.label.startsWith(
            notification.pullRequest?.head.label.split(":")[0] || ""
          ) ? (
            <>
              <Link
                href={`${notification.repository.html_url}/tree/${notification.pullRequest?.head.ref}`}
                target="_blank"
                className="hover:text-primary/85"
              >
                {notification.pullRequest?.head.ref}
              </Link>
              <MoveRight size={16} />
              <Link
                href={`${notification.repository.html_url}/tree/${notification.pullRequest?.base.ref}`}
                target="_blank"
                className="hover:text-primary/85"
              >
                {notification.pullRequest?.base.ref}
              </Link>
            </>
          ) : (
            <>
              {notification.pullRequest?.head.label}
              <ArrowRight size={16} />
              {notification.pullRequest?.base.label}
            </>
          )}
        </Muted>
        <Tabs className="mt-10 w-full" defaultValue="conversation">
          <TabsList className="w-full justify-between mb-3 h-auto gap-2 rounded-none border-b border-border bg-transparent px-0 py-1 text-foreground">
            <div className="flex gap-2 ">
              <TabsTrigger
                value="conversation"
                className="relative after:absolute after:inset-x-0 after:bottom-0 after:-mb-1 after:h-0.5 hover:bg-accent hover:text-foreground data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:after:bg-primary data-[state=active]:hover:bg-accent"
              >
                <MessagesSquare
                  className="-ms-0.5 me-1.5 opacity-60"
                  size={16}
                  strokeWidth={2}
                  aria-hidden="true"
                />
                Conversation
                <Badge
                  className="ms-1.5 min-w-5 bg-primary/15 px-1"
                  variant="secondary"
                >
                  {(notification.pullRequest?.comments ?? 0) +
                    (notification.pullRequest?.review_comments ?? 0)}
                </Badge>
              </TabsTrigger>
              <TabsTrigger
                value="commits"
                className="relative after:absolute after:inset-x-0 after:bottom-0 after:-mb-1 after:h-0.5 hover:bg-accent hover:text-foreground data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:after:bg-primary data-[state=active]:hover:bg-accent"
              >
                <GitCommit
                  className="-ms-0.5 me-1.5 opacity-60"
                  size={16}
                  strokeWidth={2}
                  aria-hidden="true"
                />
                Commits
                <Badge
                  className="ms-1.5 min-w-5 bg-primary/15 px-1"
                  variant="secondary"
                >
                  {notification.pullRequest?.commits}
                </Badge>
              </TabsTrigger>
              <TabsTrigger
                value="checks"
                className="relative after:absolute after:inset-x-0 after:bottom-0 after:-mb-1 after:h-0.5 hover:bg-accent hover:text-foreground data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:after:bg-primary data-[state=active]:hover:bg-accent"
              >
                <ListCheck
                  className="-ms-0.5 me-1.5 opacity-60"
                  size={16}
                  strokeWidth={2}
                  aria-hidden="true"
                />
                Checks
              </TabsTrigger>
              <TabsTrigger
                value="files-changed"
                className="relative after:absolute after:inset-x-0 after:bottom-0 after:-mb-1 after:h-0.5 hover:bg-accent hover:text-foreground data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:after:bg-primary data-[state=active]:hover:bg-accent"
              >
                <FilePlus
                  className="-ms-0.5 me-1.5 opacity-60"
                  size={16}
                  strokeWidth={2}
                  aria-hidden="true"
                />
                Files changed
                <Badge
                  className="ms-1.5 min-w-5 bg-primary/15 px-1"
                  variant="secondary"
                >
                  {notification.pullRequest?.changed_files}
                </Badge>
              </TabsTrigger>
            </div>
            <div className="flex gap-2 font-medium text-sm">
              <span className="text-green-500">+{notification.pullRequest?.additions}</span>
              <span className="text-red-500">-{notification.pullRequest?.deletions}</span>
            </div>
          </TabsList>
          <TabsContent value="conversation">
            <Conversation notification={notification} />
          </TabsContent>
          <TabsContent value="commits">
            <p className="pt-1 text-center text-xs text-muted-foreground">
              Content for Commits
            </p>
          </TabsContent>
          <TabsContent value="checks">
            <p className="pt-1 text-center text-xs text-muted-foreground">
              Content for Checks
            </p>
          </TabsContent>
          <TabsContent value="files-changed">
            <p className="pt-1 text-center text-xs text-muted-foreground">
              Content for Files changed
            </p>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default PullRequestThread;

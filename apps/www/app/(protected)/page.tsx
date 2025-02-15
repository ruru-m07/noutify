"use client";

import React from "react";
import { ListFilter, SlidersHorizontal } from "lucide-react";

import { Button } from "@noutify/ui/components/button";
import { ScrollArea } from "@noutify/ui/components/scroll-area";
import { useAppState } from "@/hooks/useAppState";
import Thread from "@/components/threads";
import NotificationIcon from "@/components/customs/notificationIcon";

export const dynamic = "force-dynamic";

const InboxPage = () => {
  const { notifications, setSelectedNotification, selectedNotification } =
    useAppState();

  return (
    <div className="[--margin:0.7rem] [--inbox-width:23rem] [--top-nav-height:3rem] m-[var(--margin)] bg-accent/35 border w-full h-[calc(100vh-var(--margin)*2)] rounded-md overflow-hidden flex">
      <div className="w-[--inbox-width] border-r">
        <div className="h-[var(--top-nav-height)] border-b px-4 flex items-center justify-between">
          <div>Inbox</div>
          <div>
            <Button variant={"ghost"} size={"icon"}>
              <ListFilter size={20} strokeWidth={1.5} />
            </Button>
            <Button variant={"ghost"} size={"icon"}>
              <SlidersHorizontal size={18} strokeWidth={1.75} />
            </Button>
          </div>
        </div>
        <ScrollArea className="p-2 h-[calc(100vh-var(--top-nav-height))]">
          {notifications.map((notification, i) => (
            <div
              key={i}
              className="relative rounded-md hover:bg-accent p-4 flex gap-2 cursor-pointer"
              onClick={() => {
                setSelectedNotification(notification);
              }}
            >
              {notification.unread && (
                <div className="absolute top-1/2 right-5 size-2 bg-primary rounded-full" />
              )}

              <NotificationIcon notification={notification} />

              <div className="text-sm flex flex-col">
                <span className="text-muted-foreground">
                  {notification.repository.full_name}
                  {notification.subject.type === "PullRequest" &&
                    " #" + notification.subject.url.split("/").pop()}
                </span>
                <p className="truncate w-60">{notification.subject.title}</p>
              </div>
            </div>
          ))}
          {/* // ? Empty space at bottom */}
          <div className="h-16" />
        </ScrollArea>
      </div>
      <div className="w-[calc(100vw-(var(--sidebar-width)+var(--inbox-width)+(var(--margin)*2))+3.5rem)]">
        {selectedNotification ? (
          <Thread notification={selectedNotification} />
        ) : (
          "Select a notification"
        )}
      </div>
    </div>
  );
};

export default InboxPage;

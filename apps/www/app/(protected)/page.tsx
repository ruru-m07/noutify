"use client";

import React from "react";
import { ListFilter, SlidersHorizontal } from "lucide-react";

import { Button } from "@noutify/ui/components/button";
import { ScrollArea } from "@noutify/ui/components/scroll-area";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@noutify/ui/components/popover";
import { Checkbox } from "@noutify/ui/components/checkbox";

import { useAppState } from "@/hooks/useAppState";
import Thread from "@/components/threads";
import NotificationIcon from "@/components/customs/notificationIcon";
import { Label } from "@noutify/ui/components/label";
import { Skeleton } from "@noutify/ui/components/skeleton";

export const dynamic = "force-dynamic";

const InboxPage = () => {
  const {
    notifications,
    setSelectedNotification,
    selectedNotification,
    isNotificationsLoading,
  } = useAppState();

  return (
    <>
      <div className="w-[--inbox-width] border-r">
        <div className="h-[var(--top-nav-height)] border-b px-4 flex items-center justify-between">
          <div>Inbox</div>
          <div>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Filters">
                  <ListFilter size={16} strokeWidth={2} aria-hidden="true" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-36 p-3">
                <div className="space-y-3">
                  <div className="text-xs font-medium text-muted-foreground">
                    Filters
                  </div>
                  <form className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Checkbox id={`id-1`} />
                      <Label htmlFor={`id-1`} className="font-normal">
                        Real Time
                      </Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox id={`id-2`} />
                      <Label htmlFor={`id-2`} className="font-normal">
                        Top Channels
                      </Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox id={`id-3`} />
                      <Label htmlFor={`id-3`} className="font-normal">
                        Last Orders
                      </Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox id={`id-4`} />
                      <Label htmlFor={`id-4`} className="font-normal">
                        Total Spent
                      </Label>
                    </div>
                    <div
                      role="separator"
                      aria-orientation="horizontal"
                      className="-mx-3 my-1 h-px bg-border"
                    ></div>
                    <div className="flex justify-between gap-2">
                      <Button size="sm" variant="outline" className="h-7 px-2">
                        Clear
                      </Button>
                      <Button size="sm" className="h-7 px-2">
                        Apply
                      </Button>
                    </div>
                  </form>
                </div>
              </PopoverContent>
            </Popover>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Filters">
                  <SlidersHorizontal
                    size={16}
                    strokeWidth={2}
                    aria-hidden="true"
                  />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-36 p-3">
                <div className="space-y-3">
                  <div className="text-xs font-medium text-muted-foreground">
                    Filters
                  </div>
                  <form className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Checkbox id={`id-1`} />
                      <Label htmlFor={`id-1`} className="font-normal">
                        Real Time
                      </Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox id={`id-2`} />
                      <Label htmlFor={`id-2`} className="font-normal">
                        Top Channels
                      </Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox id={`id-3`} />
                      <Label htmlFor={`id-3`} className="font-normal">
                        Last Orders
                      </Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox id={`id-4`} />
                      <Label htmlFor={`id-4`} className="font-normal">
                        Total Spent
                      </Label>
                    </div>
                    <div
                      role="separator"
                      aria-orientation="horizontal"
                      className="-mx-3 my-1 h-px bg-border"
                    ></div>
                    <div className="flex justify-between gap-2">
                      <Button size="sm" variant="outline" className="h-7 px-2">
                        Clear
                      </Button>
                      <Button size="sm" className="h-7 px-2">
                        Apply
                      </Button>
                    </div>
                  </form>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
        <ScrollArea className="p-2 h-[calc(100vh-var(--top-nav-height))]">
          {isNotificationsLoading
            ? [...Array(20)].map((_, i) => (
                <div
                  key={i}
                  className="relative rounded-md hover:bg-accent p-4 flex gap-2 cursor-pointer h-[4.5rem]"
                >
                  <Skeleton className="w-8 h-8 rounded-md" />
                  <div className="text-sm flex flex-col">
                    <Skeleton className="w-32 h-3 rounded-sm" />
                    <Skeleton className="w-52 h-3 rounded-sm mt-2" />
                  </div>
                </div>
              ))
            : notifications.map((notification, i) => (
                <div
                  key={i}
                  className="relative rounded-md hover:bg-accent p-4 flex gap-2 cursor-pointer h-[4.5rem]"
                  onClick={() => {
                    setSelectedNotification(notification);
                  }}
                >
                  {notification.unread && (
                    <div className="absolute top-1/2 right-5 -translate-x-1/2 -translate-y-1/2 size-2 bg-primary rounded-full" />
                  )}

                  <NotificationIcon notification={notification} />

                  <div className="text-sm flex flex-col">
                    <span className="text-muted-foreground">
                      {notification.repository.full_name}
                      {notification.subject.type === "PullRequest" &&
                        " #" + notification.subject.url.split("/").pop()}
                    </span>
                    <p className="truncate w-60">
                      {notification.subject.title}
                    </p>
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
    </>
  );
};

export default InboxPage;

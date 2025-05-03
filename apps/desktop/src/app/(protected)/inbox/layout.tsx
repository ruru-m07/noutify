import RenderNotificationsList from "@/components/pages/renderNotificationsList";
import { getGithubClient } from "@/lib/ghClient";
import { Button } from "@noutify/ui/components/button";
import { Checkbox } from "@noutify/ui/components/checkbox";
import { Label } from "@noutify/ui/components/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@noutify/ui/components/popover";
import { ScrollArea } from "@noutify/ui/components/scroll-area";
import { ListFilter, SlidersHorizontal } from "lucide-react";
import React from "react";

const InboxLayout = async ({ children }: { children: React.ReactNode }) => {
  const ghClient = await getGithubClient();

  const notificationsData = await ghClient.activity.listNotifications({
    // all: false,
    // read: true,
    // page: 1,
    per_page: 20,
    all: true,
    read: false,
  });

  const pullRequestNotifications = notificationsData.filter(
    (notification) => notification.subject.type === "PullRequest"
  );
  const issueNotifications = notificationsData.filter(
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

  const notifications = notificationsData.map((notification) => {
    const prIndex = pullRequestNotifications.findIndex(
      (prNotification) => prNotification.id === notification.id
    );
    if (prIndex !== -1) {
      return {
        ...notification,
        pullRequest: pullRequests[prIndex],
      };
    }

    const issueIndex = issueNotifications.findIndex(
      (issueNotification) => issueNotification.id === notification.id
    );
    if (issueIndex !== -1) {
      return {
        ...notification,
        issue: issues[issueIndex],
      };
    }

    return notification;
  });

  return (
    <>
      <div className="w-[--inbox-width] border-r">
        <div className="h-[var(--top-nav-height)] border-b px-4 flex items-center justify-between bg-primary-foreground/75">
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
                  {/* <div className="space-y-3">
                            {Object.keys(tempFilter).map((key) => (
                              <div key={key} className="flex items-center gap-2">
                                <Checkbox
                                  id={`id-${key}`}
                                  checked={tempFilter[key as keyof FilterState]}
                                  onCheckedChange={(checked) =>
                                    setTempFilter((prev) => ({
                                      ...prev,
                                      [key]: checked,
                                    }))
                                  }
                                />
                                <Label htmlFor={`id-${key}`} className="font-normal">
                                  {key.charAt(0).toUpperCase() + key.slice(1)}
                                </Label>
                              </div>
                            ))}
        
                            <div
                              role="separator"
                              aria-orientation="horizontal"
                              className="-mx-3 my-1 h-px bg-border"
                            ></div>
                            <div className="flex justify-between gap-2">
                              <Button
                                onClick={() => {
                                  setTempFilter({
                                    all: false,
                                    read: true,
                                  });
                                }}
                                size="sm"
                                variant="outline"
                                className="h-7 px-2"
                              >
                                Clear
                              </Button>
                              <Button
                                onClick={() => {
                                  setFilter(tempFilter);
                                }}
                                size="sm"
                                className="h-7 px-2"
                              >
                                Apply
                              </Button>
                            </div>
                          </div> */}
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
        {/* <ScrollArea className="p-2 h-[calc(100vh-var(--top-nav-height))]">
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
                          className="relative rounded-md hover:bg-primary-foreground/75 p-4 flex gap-2 cursor-pointer h-[4.5rem]"
                          onClick={() => {
                            console.log({
                              notification,
                            });
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
                  <div className="h-16" />
                </ScrollArea> */}

        <ScrollArea className="p-2 h-[calc(100vh-var(--top-nav-height))]">
          {notifications.map((notification, i) => (
            <RenderNotificationsList notification={notification} key={i} />
          ))}
          <div className="h-16" />
        </ScrollArea>
      </div>
      <div className="w-[calc(100vw-(var(--sidebar-width)+var(--inbox-width)+(var(--margin)*2))+3.5rem)]">
        {children}
      </div>
    </>
  );
};

export default InboxLayout;

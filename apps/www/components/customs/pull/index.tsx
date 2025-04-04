import React from "react";

import type { RestEndpointMethodTypes } from "@octokit/plugin-rest-endpoint-methods";
import { getPullRequestIcon } from "../notificationIcon";
import Link from "next/link";
import { Button, buttonVariants } from "@noutify/ui/components/button";
import { Card } from "@noutify/ui/components/card";
import {
  ArrowLeft,
  ArrowRight,
  FilePlus,
  GitCommit,
  ListCheck,
  MessagesSquare,
  MoveRight,
} from "lucide-react";
import { cn } from "@noutify/ui/lib/utils";
import { H4, Muted } from "@/components/typography";
import { Badge } from "@noutify/ui/components/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@noutify/ui/components/tabs";
import Markdown from "@/components/markdown";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@noutify/ui/components/avatar";
import { ScrollArea } from "@noutify/ui/components/scroll-area";

import * as timeago from "timeago.js";
import Image from "next/image";
import Reactions from "../comment/reactions";

interface PullProps {
  pullRequest:
    | RestEndpointMethodTypes["pulls"]["get"]["response"]["data"]
    | null;
  reactionData:
    | RestEndpointMethodTypes["reactions"]["listForIssue"]["response"]["data"]
    | null;
  num: string;
  repo: string;
  user: string;
}

export const PullRequest = ({
  pullRequest,
  reactionData,
  num,
  repo,
  user,
}: PullProps) => {
  if (!pullRequest)
    return (
      <div className="flex justify-center items-center h-full">
        <div className="loader">Loading...</div>
      </div>
    );

  return (
    <div>
      <div className="border-b px-4 flex items-center justify-between h-[var(--top-nav-height)] bg-primary-foreground/85  ">
        <div className="flex gap-2 items-center">
          <Link
            className={cn(
              buttonVariants({
                variant: "ghost",
                size: "icon",
                className: "w-8 h-8",
              })
            )}
            aria-label="Add new item"
            href={`/${user}/${repo}/pulls`}
          >
            <ArrowLeft size={16} aria-hidden="true" />
          </Link>
          <div className="w-8 h-8 flex items-center justify-center">
            {getPullRequestIcon(pullRequest)}
          </div>
          <span className="truncate w-[calc(100vw-(var(--sidebar-width)+var(--inbox-width)+(var(--margin)*2))-20rem)]">
            {pullRequest.title}
          </span>
        </div>
        <div className="gap-2 flex items-center">
          <div className="text-muted-foreground transition-all">
            <Link
              className="hover:underline hover:text-primary"
              href={`https://github.com/${user}`}
              target="_blank"
            >
              {user}
            </Link>
            {" / "}
            <Link
              className="hover:underline hover:text-primary"
              href={`https://github.com/${user}/${repo}`}
              target="_blank"
            >
              {repo}
            </Link>
          </div>

          <Link
            className={cn(
              buttonVariants({
                variant: "ghost",
                size: "sm",
                className: "text-sm",
              })
            )}
            target="_blank"
            href={pullRequest?.html_url || ""}
          >
            {" #" + num}
          </Link>
        </div>
      </div>
      <ScrollArea className="h-[calc(100vh-var(--top-nav-height))]">
        <div className="[--sectionswidth:60rem] mx-auto p-4">
          <H4 className="w-[var(--sectionswidth)] mx-auto pt-10">
            {pullRequest.title}
          </H4>
          <Muted className="w-[var(--sectionswidth)] mx-auto flex items-center gap-2 mt-1">
            {pullRequest?.head.label &&
            pullRequest?.base.label &&
            pullRequest?.head.label.startsWith(
              pullRequest?.base.label.split(":")[0] || ""
            ) &&
            pullRequest?.base.label.startsWith(
              pullRequest?.head.label.split(":")[0] || ""
            ) ? (
              <>
                <Link
                  href={`${pullRequest.html_url}/tree/${pullRequest?.head.ref}`}
                  target="_blank"
                  className="hover:text-primary/85"
                >
                  {pullRequest?.head.ref}
                </Link>
                <MoveRight size={16} />
                <Link
                  href={`${pullRequest.html_url}/tree/${pullRequest?.base.ref}`}
                  target="_blank"
                  className="hover:text-primary/85"
                >
                  {pullRequest?.base.ref}
                </Link>
              </>
            ) : (
              <>
                {pullRequest?.head.label}
                <ArrowRight size={16} />
                {pullRequest?.base.label}
              </>
            )}
          </Muted>
          <div className="my-10 w-[var(--sectionswidth)] mx-auto ">
            <div className="flex flex-col justify-center gap-7">
              <div>
                {pullRequest.requested_reviewers && (
                  <div>
                    <p className="text-muted-foreground text-sm">Reviewers</p>
                    {!(pullRequest.requested_reviewers.length === 0) ? (
                      <div className="flex gap-2 mt-2">
                        {pullRequest.requested_reviewers
                          .slice(0, 5)
                          .map((reviewer, index) => (
                            <div
                              key={index}
                              className="w-fit px-1 py-0.5 flex items-center gap-2 rounded-full border bg-primary-foreground/50"
                            >
                              <Image
                                src={`https://github.com/${reviewer.login}.png`}
                                alt={reviewer.login}
                                width={20}
                                height={20}
                                className="rounded-full"
                              />
                              <span className="text-muted-foreground mr-1">
                                {reviewer.login}
                              </span>
                            </div>
                          ))}
                        {pullRequest.requested_reviewers.length > 5 && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-7"
                          >
                            +{pullRequest.requested_reviewers.length - 5}
                          </Button>
                        )}
                      </div>
                    ) : (
                      <span className="text-muted-foreground text-sm pt-16">
                        No reviewers
                      </span>
                    )}
                  </div>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                <div>
                  <p className="text-muted-foreground text-sm">Labels </p>
                  <div className="flex gap-2 mt-2">
                    {pullRequest.labels &&
                      pullRequest.labels.map((label) => (
                        <div key={label.id}>
                          <Badge
                            variant="outline"
                            className="text-muted-foreground dark:block hidden"
                            style={{
                              color: `${adjustLabelColor(label.color, "dark")}B3`, // Adjust color based on mode
                              borderColor: `${adjustLabelColor(label.color, "dark")}B3`,
                              backgroundColor: `${adjustLabelColor(label.color, "dark")}1A`,
                            }}
                          >
                            {label.name}
                          </Badge>
                          <Badge
                            variant="outline"
                            className="text-muted-foreground dark:hidden block"
                            style={{
                              color: `${adjustLabelColor(label.color, "light")}B3`, // Adjust color based on mode
                              borderColor: `${adjustLabelColor(label.color, "light")}B3`,
                              backgroundColor: `${adjustLabelColor(label.color, "light")}1A`,
                            }}
                          >
                            {label.name}
                          </Badge>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
              {/* Assignees */}
            </div>
          </div>
          <Tabs className="w-full" defaultValue="conversation">
            <TabsList className="w-full sticky -top-1 z-10 bg-inherit backdrop-blur-3xl justify-between mb-3 h-auto gap-2 rounded-none px-0 pt-1 pb-0 text-foreground">
              <div className="w-[var(--sectionswidth)] mx-auto flex items-center justify-between border-b border-border pb-1">
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
                      {(pullRequest?.comments ?? 0) +
                        (pullRequest?.review_comments ?? 0)}
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
                      {pullRequest?.commits}
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
                      {pullRequest?.changed_files}
                    </Badge>
                  </TabsTrigger>
                </div>
                <div className="flex gap-2 font-medium text-sm">
                  <span className="text-green-500">
                    +{pullRequest?.additions}
                  </span>
                  <span className="text-red-500">
                    -{pullRequest?.deletions}
                  </span>
                </div>
              </div>
            </TabsList>
            <TabsContent
              value="conversation"
              className="w-[var(--sectionswidth)] mx-auto"
            >
              <div className="flex relative mb-7 w-full border-none shadow-none rounded-md mt-5">
                <div>
                  <Avatar asChild>
                    <Link href={`https://github.com/${pullRequest.user.login}`}>
                      <AvatarImage
                        src={`https://github.com/${pullRequest.user.login}.png`}
                        alt={pullRequest.user.login}
                      />
                      <AvatarFallback> </AvatarFallback>
                    </Link>
                  </Avatar>
                </div>
                <div
                  className={`w-full ml-4 comment-triangle after:bg-[#fafafa] before:bg-[#fafafa] after:dark:bg-[#171717] before:dark:bg-[#171717] comment-triangle-action`}
                >
                  <Card className={`w-full rounded-md`}>
                    <div
                      className={cn(
                        `border-b p-3 rounded-t-md bg-primary-foreground flex justify-between w-full relative`,
                        "after:content-[''] after:absolute after:-left-2 after:top-1/2 after:w-4 after:h-4 after:bg-primary-foreground after:border after:border-border after:-z-10 after:rotate-45 after:transform after:-translate-y-1/2",
                        "before:content-[''] before:absolute before:-left-px before:top-1/2 before:w-1 before:h-5 before:bg-primary-foreground before:transform before:-translate-y-1/2"
                      )}
                    >
                      <p className="text-muted-foreground text-sm">
                        {pullRequest.user.login} commented {}
                        {new Date(
                          pullRequest.updated_at || pullRequest.created_at
                        ).getTime() >
                        Date.now() - 7 * 24 * 60 * 60 * 1000
                          ? timeago.format(
                              pullRequest.updated_at || pullRequest.created_at,
                              "en_US"
                            )
                          : new Date(
                              pullRequest.updated_at || pullRequest.created_at
                            ).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                        {pullRequest.updated_at !== pullRequest.created_at &&
                          " • Edited"}
                      </p>
                      <div className="flex items-center justify-center gap-2">
                        <Badge
                          variant="outline"
                          className="text-muted-foreground"
                        >
                          Contributor
                        </Badge>
                      </div>
                    </div>
                    <div className="px-4 pt-2">
                      {pullRequest.body && (
                        <Markdown
                          github={`${user}/${repo}`}
                          markdown={pullRequest.body}
                        />
                      )}
                    </div>
                    <Reactions repoUser={user} repoName={repo} pullRequestNumber={num} reactionData={reactionData} />
                  </Card>
                </div>
              </div>
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
          <div className="h-screen">{/* // TODO: ------ */}</div>
        </div>
      </ScrollArea>
    </div>
  );
};

function adjustLabelColor(color: string, mode: "light" | "dark") {
  const hexToRgb = (hex: string) => {
    const bigint = parseInt(hex, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return { r, g, b };
  };

  const luminance = (r: number, g: number, b: number) => {
    const a = [r, g, b].map((v) => {
      v /= 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    // @ts-expect-error - ...
    return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
  };

  const { r, g, b } = hexToRgb(color);
  const lum = luminance(r, g, b);

  if (r === 0 && g === 0 && b === 0 && mode === "dark") {
    return "#FFFFFF";
  }

  if (mode === "dark" && lum < 0.5) {
    return `#${color}FF`;
  } else if (mode === "light" && lum >= 0.5) {
    return `#${color}99`;
  }
  return `#${color}`;
}

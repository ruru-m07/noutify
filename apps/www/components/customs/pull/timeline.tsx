/* eslint-disable @next/next/no-img-element */
import React from "react";

import type { RestEndpointMethodTypes } from "@octokit/plugin-rest-endpoint-methods";
import {
  BookUp2,
  GitBranch,
  GitCommitHorizontal,
  GitMerge,
  GitPullRequestClosed,
  Rocket,
  SearchCheck,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@noutify/ui/lib/utils";
import type { CommentedProps } from "./commented";
import Commente from "./commented";
import * as timeago from "timeago.js";
import { Badge } from "@noutify/ui/components/badge";
import { auth } from "@/auth";
import { getCommit } from "@noutify/functions/custom/api";
import { getGithubClient } from "@/lib/ghClient";
import ReviewedComment from "./reviewedComment";

interface TimelineProps {
  timeline: RestEndpointMethodTypes["issues"]["listEventsForTimeline"]["response"]["data"];
  repoUser: string;
  repoName: string;
  threadNumber: string;
}

const Timeline = async ({
  timeline,
  repoName,
  repoUser,
  threadNumber,
}: TimelineProps) => {
  const ghClient = await getGithubClient();
  const listReviewComments = await ghClient.pulls.listReviewComments(
    repoUser,
    repoName,
    Number(threadNumber)
  );

  return (
    <div className="timeline">
      {timeline.map(
        (
          event: RestEndpointMethodTypes["issues"]["listEventsForTimeline"]["response"]["data"][0],
          i
        ) => {
          switch (event.event) {
            case "committed": {
              return (
                <div className="ml-20" key={i}>
                  <div className="w-0.5 h-3 bg-secondary ml-2" />
                  <CommittedEvent
                    repoName={repoName}
                    repoUser={repoUser}
                    event={event}
                    key={i}
                  />
                </div>
              );
            }

            case "commented": {
              const data = event as CommentedProps;
              return (
                <div key={i}>
                  <div className="w-0.5 h-7 bg-secondary ml-[5.5rem]" />
                  <Commente
                    actor={data.actor}
                    body={data.body}
                    created_at={data.created_at}
                    updated_at={data.updated_at}
                    repositoryName={repoName}
                    repositoryUser={repoUser}
                    threadNumber={threadNumber}
                    id={data.id}
                    author_association={data.author_association}
                  />
                </div>
              );
            }

            case "head_ref_force_pushed": {
              const data = event as {
                actor: {
                  login: string;
                  avatar_url: string;
                };
                created_at: string;
              };

              return (
                <div key={i} className="ml-20">
                  <div className="w-0.5 h-3 bg-secondary ml-2" />
                  <Link
                    href={"#"}
                    className="group flex items-center gap-3 my-2 -ml-1"
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-3">
                        <div className="p-1.5 border rounded-full bg-primary-foreground flex items-center justify-center size-7 -mr-1.5">
                          <BookUp2
                            className="text-muted-foreground/70 group-hover:text-primary/90 "
                            size={16}
                          />
                        </div>
                        <img
                          src={data.actor.avatar_url}
                          alt={data.actor.login}
                          className="size-5 rounded-full"
                        />{" "}
                        <div
                          className={cn(
                            "w-[45rem] truncate group-hover:text-primary/65 text-muted-foreground/55"
                          )}
                        >
                          {" "}
                          <span className="text-primary">
                            {data.actor.login}
                          </span>
                          <span className="underline pl-1">force-pushed</span>
                          <span>
                            {" "}
                            {timeago.format(new Date(data.created_at))}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              );
            }

            case "deployed": {
              const data = event as {
                actor: {
                  login: string;
                  avatar_url: string;
                };
                created_at: string;
              };

              return (
                <div key={i} className="ml-20">
                  <div className="w-0.5 h-3 bg-secondary ml-2" />
                  <Link
                    href={"#"}
                    className="group flex items-center gap-3 my-2 -ml-1"
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-3">
                        <div className="p-1.5 border rounded-full bg-primary-foreground flex items-center justify-center size-7 -mr-1.5">
                          <Rocket
                            className="text-muted-foreground/70 group-hover:text-primary/90 "
                            size={16}
                          />
                        </div>
                        <img
                          src={data.actor.avatar_url}
                          alt={data.actor.login}
                          className="size-5 rounded-full"
                        />
                        <div
                          className={cn(
                            "w-[45rem] truncate group-hover:text-primary/65 text-muted-foreground/55"
                          )}
                        >
                          <span className="text-primary">
                            {data.actor.login.split("[")[0]}
                          </span>
                          <Badge variant={"outline"} className="mx-1">
                            Bot
                          </Badge>
                          <span className="pl-1">deployed a preview</span>
                          <span>
                            {" "}
                            {timeago.format(new Date(data.created_at))}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              );
            }

            case "closed": {
              const data = event as {
                actor: {
                  login: string;
                  avatar_url: string;
                };
                created_at: string;
              };

              return (
                <div key={i} className="">
                  <div className="w-0.5 h-3 bg-secondary ml-[5.5rem]" />
                  <Link
                    href={"#"}
                    className="group flex items-center gap-3 my-2 ml-[4.75rem]"
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-3">
                        <div className="p-1.5 rounded-full bg-destructive flex items-center justify-center size-7 -mr-1.5">
                          <GitPullRequestClosed size={16} />
                        </div>
                        <img
                          src={data.actor.avatar_url}
                          alt={data.actor.login}
                          className="size-5 rounded-full"
                        />{" "}
                        <div
                          className={cn(
                            "w-[45rem] truncate group-hover:text-primary/65 text-muted-foreground/55"
                          )}
                        >
                          {" "}
                          <span className="text-primary">
                            {data.actor.login}
                          </span>
                          <span className="pl-1">closed this</span>
                          <span>
                            {" "}
                            {timeago.format(new Date(data.created_at))}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>

                  <div className="w-0.5 h-3 bg-secondary ml-[5.5rem]" />
                  <div className="w-full h-[3px] rounded-full bg-secondary" />
                </div>
              );
            }

            case "head_ref_deleted": {
              const data = event as {
                actor: {
                  login: string;
                  avatar_url: string;
                };
                created_at: string;
              };

              return (
                <div key={i} className="ml-20">
                  <div className="w-0.5 h-3 bg-secondary ml-2" />
                  <Link
                    href={"#"}
                    className="group flex items-center gap-3 my-2 -ml-1"
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-3">
                        <div className="p-1.5 border rounded-full bg-secondary flex items-center justify-center size-7 -mr-1.5">
                          <GitBranch
                            className="text-muted-foreground/70 group-hover:text-primary/90 "
                            size={16}
                          />
                        </div>
                        <img
                          src={data.actor.avatar_url}
                          alt={data.actor.login}
                          className="size-5 rounded-full"
                        />{" "}
                        <div
                          className={cn(
                            "w-[45rem] truncate group-hover:text-primary/65 text-muted-foreground/55"
                          )}
                        >
                          {" "}
                          <span className="text-primary">
                            {data.actor.login}
                          </span>
                          <span className="pl-1">deleted the head ref</span>
                          <span>
                            {" "}
                            {timeago.format(new Date(data.created_at))}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              );
            }

            case "ready_for_review": {
              const data = event as {
                actor: {
                  login: string;
                  avatar_url: string;
                };
                created_at: string;
              };

              return (
                <div key={i} className="ml-20">
                  <div className="w-0.5 h-3 bg-secondary ml-2" />
                  <Link
                    href={"#"}
                    className="group flex items-center gap-3 my-2 -ml-1"
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-3">
                        <div className="p-1.5 border rounded-full bg-primary-foreground flex items-center justify-center size-7 -mr-1.5">
                          <SearchCheck
                            className="text-muted-foreground/70 group-hover:text-primary/90 "
                            size={16}
                          />
                        </div>
                        <img
                          src={data.actor.avatar_url}
                          alt={data.actor.login}
                          className="size-5 rounded-full"
                        />
                        <div
                          className={cn(
                            "w-[45rem] truncate group-hover:text-primary/65 text-muted-foreground/55"
                          )}
                        >
                          <span className="text-primary">
                            {data.actor.login}
                          </span>
                          <span className="pl-1">
                            marked this pull request as ready for review{" "}
                          </span>
                          <span>
                            {timeago.format(new Date(data.created_at))}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              );
            }

            case "review_requested": {
              const data = event as {
                actor: {
                  login: string;
                  avatar_url: string;
                };
                created_at: string;
              };

              return (
                <div key={i} className="ml-20">
                  <div className="w-0.5 h-3 bg-secondary ml-2" />
                  <Link
                    href={"#"}
                    className="group flex items-center gap-3 my-2 -ml-1"
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-3">
                        <div className="p-1.5 border rounded-full bg-primary-foreground flex items-center justify-center size-7 -mr-1.5">
                          <SearchCheck
                            className="text-muted-foreground/70 group-hover:text-primary/90 "
                            size={16}
                          />
                        </div>
                        <img
                          src={data.actor.avatar_url}
                          alt={data.actor.login}
                          className="size-5 rounded-full"
                        />
                        <div
                          className={cn(
                            "w-[45rem] truncate group-hover:text-primary/65 text-muted-foreground/55"
                          )}
                        >
                          <span className="text-primary">
                            {data.actor.login}
                          </span>
                          <span className="pl-1">
                            marked this pull request as ready for review{" "}
                          </span>
                          <span>
                            {timeago.format(new Date(data.created_at))}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              );
            }

            case "reviewed": {
              const reviewComment = listReviewComments.find(
                (comment) => comment.pull_request_review_id === event.id
              );

              if (!reviewComment) return null;

              // ? we have revireComment.id we want to find all the comments that have in_reply_to_id === revireComment.id
              // ? it should be a list of comments
              const resolvedComments = listReviewComments.filter(
                (comment) => comment.in_reply_to_id === reviewComment.id
              );

              return reviewComment ? (
                <ReviewedComment key={i} reviewComment={reviewComment} comments={resolvedComments} />
              ) : null;
            }

            default:
              return (
                <div key={i} className="event">
                  {/* // TODO(ruru-m07): fuk more edge cases bcus gh isn;t giveing types  */}
                  <p>{event.event}</p>
                </div>
              );
          }
        }
      )}
    </div>
  );
};

export default Timeline;

interface CommittedEventProps {
  // ! @ts-expect-error - github has some skill issues with types
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  event: any;
  repoUser: string;
  repoName: string;
}

const CommittedEvent = async ({
  event,
  repoName,
  repoUser,
}: CommittedEventProps) => {
  const session = await auth();

  const commit = await getCommit(
    repoUser,
    repoName,
    event.sha,
    session.user.accessToken
  );

  return (
    <Link href={"#"} className="group flex items-center gap-3">
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-3">
          {commit.commit.message?.startsWith("Merge branch") ? (
            <GitMerge
              className="text-muted-foreground/40 group-hover:text-primary/65 ml-[5px] -mr-[2px]"
              size={16}
            />
          ) : (
            <GitCommitHorizontal
              className="text-muted-foreground/55 group-hover:text-primary/65"
              size={19}
            />
          )}
          <img
            src={commit.author.avatar_url}
            alt={commit.author.login}
            className="size-5 rounded-full"
          />{" "}
          <p
            className={cn(
              "w-[45rem] truncate group-hover:text-primary/65",
              commit.commit.message?.startsWith("Merge branch")
                ? "text-muted-foreground/35"
                : "text-muted-foreground/55"
            )}
          >
            {" "}
            {commit.commit.message || "No message"}
          </p>
        </div>
        <span className="text-muted-foreground/40 text-sm group-hover:text-primary/65">
          {event.sha.substring(0, 7)}
        </span>
      </div>
    </Link>
  );
};

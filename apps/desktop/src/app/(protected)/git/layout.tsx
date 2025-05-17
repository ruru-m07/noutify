"use client";

import type React from "react";
import { ScrollArea } from "@noutify/ui/components/scroll-area";
import {
  ArrowDown,
  ArrowUp,
  BookDashed,
  ChevronDown,
  ChevronDownIcon,
  ChevronUp,
  Lock,
  SearchIcon,
} from "lucide-react";
import { H4 } from "@/components/typography";
import { Badge } from "@noutify/ui/components/badge";
import { cn } from "@noutify/ui/lib/utils";
import { Button } from "@noutify/ui/components/button";
import { Textarea } from "@noutify/ui/components/textarea";
import { Input } from "@noutify/ui/components/input";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@noutify/ui/components/avatar";
import { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@noutify/ui/components/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@noutify/ui/components/tooltip";
import ChangedFiles from "@/components/customs/git/changed";
import { getUserRepos, saveUserRepoPath } from "@/actions/electrone";
import { toast } from "sonner";
import { useGit } from "@/context/git";

const GitPageLayout = ({ children }: { children: React.ReactNode }) => {
  const [repoSelectIsOpen, setRepoSelectIsOpen] = useState(false);

  const {
    allLocalRepos,
    updateRepoList,
    updateSelectRepo,
    selectedRepo,
    status,
  } = useGit();

  const formattedRepos = allLocalRepos.reduce(
    (acc, repo) => {
      const key = repo.repoUsername || "other";
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push({
        id: repo.id,
        name: repo.name,
        path: repo.path,
        fullName: (repo.repoUsername as string) + "/" + repo.repoName,
        visibility: repo.isPrivate ? "private" : "public",
        isSelected: selectedRepo?.id === repo.id,
      });
      return acc;
    },
    {} as Record<
      string,
      Array<{
        id: string;
        name: string;
        path: string;
        fullName: string;
        visibility: string;
        isSelected: boolean;
      }>
    >
  );

  return (
    <>
      <div className="w-[--inbox-width] [--top-nav-height:70px] border-r flex flex-col h-screen">
        <div className="flex flex-col flex-grow overflow-hidden">
          <div
            onClick={() => {
              setRepoSelectIsOpen((p) => !p);
            }}
            className="h-[var(--top-nav-height)] cursor-pointer transition-all duration-75 border-b px-4 flex items-center justify-between bg-primary-foreground/75 hover:bg-primary-foreground flex-shrink-0"
          >
            <div className="flex items-center gap-2">
              <BookDashed />
              <div className="flex items-center gap-1">
                <H4 className="w-[var(--inbox-width)-200px] truncate">
                  {selectedRepo?.repoName}
                </H4>
                <span className="mx-2 text-lg">{" • "}</span>
                <Badge variant="outline" className="gap-1 py-1 pr-3">
                  <ArrowUp
                    className="text-emerald-500"
                    size={18}
                    aria-hidden="true"
                  />
                  3
                </Badge>
                <Badge variant="outline" className="gap-1 py-1 pr-3">
                  <ArrowDown
                    className="text-red-500"
                    size={18}
                    aria-hidden="true"
                  />
                  4
                </Badge>
              </div>
            </div>
            {repoSelectIsOpen ? <ChevronUp /> : <ChevronDown />}
          </div>
          {repoSelectIsOpen ? (
            <>
              <div className="flex border-b flex-shrink-0 p-4 gap-4 bg-primary-foreground/75 z-10">
                <div className="*:not-first:mt-2">
                  <div className="relative">
                    <Input
                      className="peer ps-9 pe-9"
                      placeholder="Search local repository..."
                      type="search"
                    />
                    <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
                      <SearchIcon size={16} />
                    </div>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button>
                      Add
                      <ChevronDownIcon
                        className="-me-1 ml-1 opacity-60"
                        size={16}
                        aria-hidden="true"
                      />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="min-w-(--radix-dropdown-menu-trigger-width)">
                    <DropdownMenuItem>Clone repository...</DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={async () => {
                        try {
                          const folderPath =
                            await window.electron.selectFolder();
                          if (folderPath) {
                            const data = await saveUserRepoPath(folderPath);

                            if (data.error) {
                              console.log(data.error);
                              toast.error(data.error);
                            }

                            if (data.success) {
                              toast.success(
                                "Local repository added successfully!"
                              );
                              updateSelectRepo(data.data?.id as string);
                            }
                          } else {
                            console.log("Folder selection was canceled.");
                          }
                        } catch (error) {
                          console.error("Error selecting folder:", error);
                          toast.error("Failed to add local repository.");
                        } finally {
                          updateRepoList();
                          setRepoSelectIsOpen(false);
                        }
                      }}
                    >
                      Add local repository...
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <ScrollArea className="flex-grow p-4 bg-primary-foreground/75 z-10">
                {Object.entries(formattedRepos).map(([key, value]) => {
                  return (
                    <div key={key} className="flex flex-col px-2 py-3">
                      <span className="text-muted-foreground mb-2">{key}</span>
                      <div className="flex flex-col gap-2 items-start">
                        {value.map((v, k) => (
                          <TooltipProvider key={k} delayDuration={2000}>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant={"ghost"}
                                  className={cn(
                                    "w-full justify-between text-lg",
                                    v.isSelected
                                      ? "bg-accent-foreground/10"
                                      : ""
                                  )}
                                  onClick={async () => {
                                    if (!v.isSelected) {
                                      await updateSelectRepo(v.id);
                                      setRepoSelectIsOpen(false);
                                    }
                                  }}
                                >
                                  <div className="flex items-center gap-2">
                                    {v.name}
                                    {v.visibility === "private" && (
                                      <Lock
                                        className="-me-1 ml-2 opacity-60"
                                        size={16}
                                        aria-hidden="true"
                                      />
                                    )}
                                  </div>
                                  {v.isSelected && (
                                    <div className="size-2 bg-emerald-500 rounded-full"></div>
                                  )}
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent
                                side="right"
                                className="px-2 py-1 "
                              >
                                {v.fullName}
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        ))}
                      </div>
                    </div>
                  );
                })}
                <div className="h-16" />
              </ScrollArea>
            </>
          ) : (
            <>
              <div className="grid grid-cols-2 border-b flex-shrink-0 h-11">
                <div
                  className={cn(
                    "border-r gap-2 px-4 cursor-pointer py-2 flex justify-center items-center hover:bg-primary-foreground/75",
                    true && "bg-primary-foreground/75"
                  )}
                >
                  Changes
                  <Badge>{status?.files.length}</Badge>
                </div>
                <div
                  className={cn(
                    "px-4 py-2 flex cursor-pointer justify-center items-center hover:bg-primary-foreground/75",
                    false && "bg-primary-foreground/75"
                  )}
                >
                  History
                </div>
              </div>

              <ChangedFiles />
            </>
          )}
        </div>
        {!repoSelectIsOpen && (
          <div className="w-full p-4 flex flex-col gap-2 flex-shrink-0 border-t mb-6">
            <div className="flex items-center gap-2">
              <Avatar className="rounded-lg border scale-90">
                <AvatarImage
                  src="https://github.com/ruru-m07.png"
                  alt="Kelly King"
                />
                <AvatarFallback>KK</AvatarFallback>
              </Avatar>
              <Input placeholder="Summary... (required)" />
            </div>
            <Textarea
              id={"textarea"}
              placeholder="Some Description..."
              className="min-h-20"
            />
            <Button className="w-full">
              commit to <b className="ml-1">main</b>
            </Button>
          </div>
        )}
      </div>
      <div
        className={cn(
          "w-[calc(100vw-(var(--sidebar-width)+var(--inbox-width)+(var(--margin)*2))+3.5rem)]",
          repoSelectIsOpen && "blur-xl cursor-pointer"
        )}
        onClick={() => {
          if (repoSelectIsOpen) {
            setRepoSelectIsOpen(false);
          }
        }}
      >
        {children}
      </div>
    </>
  );
};

export default GitPageLayout;

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
import { useState } from "react";
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

const dummyData2 = {
  vercel: [
    {
      name: "next.js",
      path: "/home/ruru/projects/next.js",
      fullName: "vercel/next.js",
      visibility: "public",
      anyUpdate: true,
    },
    {
      name: "ai",
      path: "/home/ruru/projects/ai",
      fullName: "vercel/ai",
      visibility: "private",
      anyUpdate: false,
    },
    {
      name: "turborepo",
      path: "/home/ruru/projects/turborepo",
      fullName: "vercel/turborepo",
      visibility: "public",
      anyUpdate: true,
    },
    {
      name: "swr",
      path: "/home/ruru/projects/swr",
      fullName: "vercel/swr",
      visibility: "private",
      anyUpdate: false,
    },
  ],
  shadcn: [
    {
      name: "training-kit",
      path: "/home/ruru/projects/training-kit",
      fullName: "shadcn/training-kit",
      visibility: "public",
      anyUpdate: false,
    },
    {
      name: "choosealicense.com",
      path: "/home/ruru/projects/choosealicense.com",
      fullName: "shadcn/choosealicense.com",
      visibility: "private",
      anyUpdate: true,
    },
    {
      name: "gh-ost",
      path: "/home/ruru/projects/gh-ost",
      fullName: "shadcn/gh-ost",
      visibility: "public",
      anyUpdate: false,
    },
  ],
  oraczen: [
    {
      name: "zendesign",
      path: "/home/ruru/projects/zendesign",
      fullName: "oraczen/zendesign",
      visibility: "private",
      anyUpdate: true,
    },
    {
      name: "farmerediteast",
      path: "/home/ruru/projects/farmerediteast",
      fullName: "oraczen/farmerediteast",
      visibility: "public",
      anyUpdate: false,
    },
  ],
  "ruru-m07": [
    {
      name: "noutify",
      path: "/home/ruru/projects/noutify",
      fullName: "ruru-m07/noutify",
      visibility: "private",
      anyUpdate: true,
    },
    {
      name: "ruru-ui",
      path: "/home/ruru/projects/ruru-ui",
      fullName: "ruru-m07/ruru-ui",
      visibility: "public",
      anyUpdate: true,
    },
    {
      name: "commitly",
      path: "/home/ruru/projects/commitly",
      fullName: "ruru-m07/commitly",
      visibility: "private",
      anyUpdate: false,
    },
  ],
  other: [
    {
      name: "other-repo",
      path: "/home/ruru/projects/other-repo",
      fullName: "other/other-repo",
      visibility: "public",
      anyUpdate: false,
    },
  ],
};

const GitPageLayout = ({ children }: { children: React.ReactNode }) => {
  const [repoSelectIsOpen, setRepoSelectIsOpen] = useState(false);

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
                <H4>noutify</H4>
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
                    <DropdownMenuItem>Add local repository...</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <ScrollArea className="flex-grow p-4 bg-primary-foreground/75 z-10">
                {Object.entries(dummyData2).map(([key, value]) => {
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
                                  className="w-full justify-between text-lg"
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
                                  {v.anyUpdate && (
                                    <div className="size-2 bg-blue-500 rounded-full"></div>
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
                  <Badge>69</Badge>
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
            <Button
              onClick={async () => {
                const folderPath = await window.electron.selectFolder();
                if (folderPath) {
                  console.log("Selected folder:", folderPath);
                  // Do something with folderPath
                } else {
                  console.log("Folder selection was canceled.");
                }
              }}
              className="w-full"
            >
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

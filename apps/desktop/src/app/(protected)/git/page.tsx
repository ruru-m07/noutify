"use client";

import { DiffViewer } from "@/components/customs/diff/diff-viewer";
import { getStatusIcon } from "@/components/customs/git/changed";
import { useGit } from "@/context/git";
import { Badge } from "@noutify/ui/components/badge";
import { Button } from "@noutify/ui/components/button";
import { Label } from "@noutify/ui/components/label";
import { ScrollArea } from "@noutify/ui/components/scroll-area";
import {
  ArrowDown,
  ChevronDown,
  GitBranchIcon,
  RefreshCcwDot,
  Settings,
  SquareDot,
} from "lucide-react";
import React from "react";

const Page = () => {
  const { selectedFile } = useGit();

  return (
    <div className="flex flex-col flex-grow overflow-hidden">
      <div className="h-[70px] cursor-pointer transition-all duration-75 border-b px-4 flex items-center justify-start gap-4 bg-primary-foreground/75 flex-shrink-0">
        <div className="border-r gap-2 h-full flex min-w-52 items-center pr-4 hover:bg-primary-foreground">
          <div className="flex items-center gap-2">
            <GitBranchIcon size={26} />
            <div className="mx-2 flex flex-col">
              <span className="text-sm text-muted-foreground">
                Current branch
              </span>
              <span className="truncate w-44">
                21-fix-auth-workflow-for-desktop-use-local-polling-instant
              </span>
            </div>
            {/* <div className="flex items-center gap-2 ml-2">
              <Badge variant="outline" className="gap-1 py-1 pr-3">
                <ArrowDown size={18} aria-hidden="true" />4
              </Badge>
            </div> */}
          </div>
          <ChevronDown />
        </div>
        <div className="border-r gap-2 h-full flex min-w-52 items-center pr-4 hover:bg-primary-foreground">
          <div className="flex items-center gap-2">
            <RefreshCcwDot size={26} />
            <div className="mx-2 flex flex-col">
              <span className="text-sm text-muted-foreground">
                Fetch origin
              </span>
              <span className="truncate w-44">Last fetched 10 minutes ago</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="gap-1 py-1 pr-3">
                <ArrowDown size={18} aria-hidden="true" />4
              </Badge>
            </div>
          </div>
        </div>
      </div>
      <div className="h-11 border-b flex items-center justify-between px-4 gap-2">
        <div className="flex items-center gap-2">
          {selectedFile?.meta && getStatusIcon(selectedFile?.meta)}
          <Label className="flex items-center min-w-0 w-full">
            {selectedFile?.meta.path.split("/").slice(0, -1).join("/") && (
              <>
                <span className="text-muted-foreground -mr-0.5">
                  {selectedFile.meta.path.split("/").slice(0, -1).join("/")}
                </span>
                <span className="text-muted-foreground">/</span>
              </>
            )}
            <span className="flex-shrink-0">
              {selectedFile?.meta.path.split("/").slice(-1)[0]}
            </span>
          </Label>
        </div>
        <Button variant={"ghost"} size="icon">
          <Settings size={20} />
        </Button>
      </div>
      <ScrollArea className="w-full h-screen">
        <DiffViewer />
      </ScrollArea>
    </div>
  );
};

export default Page;

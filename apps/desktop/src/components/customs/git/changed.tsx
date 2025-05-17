"use client";

import React from "react";
import { useEffect } from "react";

import { addStaged, getGitStatus, removeStaged } from "@noutify/git";

import { Checkbox } from "@noutify/ui/components/checkbox";
import { Label } from "@noutify/ui/components/label";
import { ScrollArea } from "@noutify/ui/components/scroll-area";
import { cn } from "@noutify/ui/lib/utils";

import { AlertTriangle, SquareDot, SquarePlus, SquareX } from "lucide-react";
import { useGit } from "@/context/git";
import type { FileStatusResult } from "simple-git";

const ChangedFiles = () => {
  const { status, selectedRepo, updateGitDiff } = useGit();

  useEffect(() => {
    try {
      if (selectedRepo?.path && status?.files.length) {
        updateGitDiff(selectedRepo?.path, status?.files[0]);
      }
    } catch (error) {
      console.error("Error in GitProvider:", error);
    }
  }, [selectedRepo, selectedRepo?.path, status]);

  return (
    <>
      <div className="flex items-center p-4 border-b flex-shrink-0">
        <div className="flex items-center gap-2">
          <Checkbox
            checked={
              status?.staged?.length === status?.files?.length
                ? true
                : status?.staged?.length
                  ? "indeterminate"
                  : false
            }
            id="select-all"
            onCheckedChange={(c) => {
              if (c) {
                addStaged("/home/ruru/Projects/noutify", ".");
                // getStatus();
              } else {
                removeStaged("/home/ruru/Projects/noutify", ".");
                // getStatus();
              }
            }}
          />
        </div>
        <div className="w-full flex items-center justify-center gap-2 -ml-4">
          <Label htmlFor="select-all">
            {status?.files.length} Changed files
          </Label>
        </div>
      </div>
      <ScrollArea className="flex-grow">
        {status?.files.map((v, i) => {
          return (
            <div
              key={i}
              className={cn(
                "flex hover:bg-primary-foreground/75 cursor-pointer items-center justify-between px-4 py-3 _border-b"
              )}
            >
              <div className="flex items-center w-full">
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Checkbox
                    id={`id-${i}`}
                    defaultChecked={status.staged.includes(v.path)}
                    onCheckedChange={(c) => {
                      if (c) {
                        addStaged("/home/ruru/Projects/noutify", v.path);
                        // getStatus();
                      } else {
                        removeStaged("/home/ruru/Projects/noutify", v.path);
                        // getStatus();
                      }
                    }}
                  />
                </div>
                <div className="flex items-center gap-0 ml-2 min-w-0 w-full">
                  <Label
                    // htmlFor={`id-${i}`}
                    className="flex items-center min-w-0 w-full"
                    onClick={() => {
                      if (selectedRepo?.path) {
                        updateGitDiff(selectedRepo?.path, v);
                      }
                    }}
                  >
                    {v?.path.split("/").slice(0, -1).join("/") && (
                      <>
                        <span className="text-muted-foreground truncate max-w-28 -mr-0.5">
                          {v.path.split("/").slice(0, -1).join("/")}
                        </span>
                        <span className="text-muted-foreground">/</span>
                      </>
                    )}
                    <span className="flex-shrink-0">
                      {v?.path.split("/").slice(-1)[0]}
                    </span>
                  </Label>
                </div>
              </div>
              <div className="flex-shrink-0 ml-2">
                 {getStatusIcon(v)}
              </div>
            </div>
          );
        })}
      </ScrollArea>
    </>
  );
};

export default ChangedFiles;

export function getStatusIcon(v: FileStatusResult) {
  return (
    <>
      {v.index === "U" || v.working_dir === "U" ? (
        <AlertTriangle className="text-orange-500" size={20} />
      ) : v.index === "D" || v.working_dir === "D" ? (
        <SquareX className="text-red-500" size={20} />
      ) : v.index === "A" || v.working_dir === "?" || v.index === "?" ? (
        <SquarePlus className="text-green-500" size={20} />
      ) : v.index === "M" || v.working_dir === "M" ? (
        <SquareDot className="text-yellow-500" size={20} />
      ) : null}
    </>
  );
}

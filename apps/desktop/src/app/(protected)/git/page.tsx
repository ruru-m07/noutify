import { DiffViewer } from "@/components/customs/diff/diff-viewer";
import { Badge } from "@noutify/ui/components/badge";
import { Button } from "@noutify/ui/components/button";
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

const Page = async () => {
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
          <SquareDot className="text-yellow-500" size={20} />
          <div>
            <span className="text-muted-foreground">
              apps/desktop/electron/src/
            </span>
            <span>main.ts</span>
          </div>
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

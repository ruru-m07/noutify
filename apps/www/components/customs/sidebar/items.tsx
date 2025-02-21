"use client";

import React from "react";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@noutify/ui/components/tooltip";
import { Button } from "@noutify/ui/components/button";
import { cn } from "@noutify/ui/lib/utils";
import {
  CircleDot,
  GitPullRequestArrow,
  Inbox,
  type LucideIcon,
} from "lucide-react";

type Item = {
  icon: LucideIcon;
  name: string;
  href: string;
};

const SideBarItems: React.FC = () => {
  const pathname = usePathname();

  const items: Item[] = [
    {
      icon: Inbox,
      name: "Inbox",
      href: "/",
    },
    {
      icon: GitPullRequestArrow,
      name: "pull requests",
      href: "/pulls",
    },
    {
      icon: CircleDot,
      name: "Issues",
      href: "/issues",
    },
  ];

  return items.map((item: Item) => (
    <Link href={item.href} key={item.name}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size={"icon"}
            className={cn(pathname === item.href && "bg-accent")}
          >
            <item.icon
              className="opacity-60"
              size={16}
              strokeWidth={2}
              aria-hidden="true"
            />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="left" className="px-2 py-1 text-xs">
          {item.name}
        </TooltipContent>
      </Tooltip>
    </Link>
  ));
};

export default SideBarItems;

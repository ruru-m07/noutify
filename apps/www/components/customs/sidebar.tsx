"use client";

import React from "react";
import {
  Bolt,
  BookOpen,
  CircleDot,
  GitPullRequestArrow,
  Inbox,
  Layers2,
  LogOut,
  Pin,
  UserPen,
  type LucideIcon,
} from "lucide-react";

import { Button } from "@noutify/ui/components/button";
import Link from "next/link";
import ThemeSwitcher from "../themeSwitcher";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@noutify/ui/components/dropdown-menu";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@noutify/ui/components/avatar";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@noutify/ui/components/tooltip";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@noutify/ui/components/hover-card";
import { usePathname } from "next/navigation";
import { cn } from "@noutify/ui/lib/utils";
import { useAppState } from "@/hooks/useAppState";

const Sidebar = () => {
  const Items: Array<{
    icon: LucideIcon;
    name: string;
    href: string;
  }> = [
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

  const pathname = usePathname();
  const { user } = useAppState();

  return (
    <div className="h-screen w-[--sidebar-width] flex flex-col justify-between items-center -mr-2">
      <div className="w-full m-2 mt-4 flex flex-col items-center">
        <HoverCard>
          <HoverCardTrigger asChild>
            <Image
              src={"/assets/logo_dark.svg"}
              alt="catra logo"
              width={40}
              height={40}
            />
          </HoverCardTrigger>
          <HoverCardContent side="left" className="w-[340px] mt-2">
            <div className="flex items-start gap-3">
              <Image
                src={"/assets/logo_dark.svg"}
                alt="catra logo"
                width={40}
                height={40}
              />
              <div className="space-y-1">
                <p className="text-sm font-sans">
                  Powered by{" "}
                  <Link
                    target="_blank"
                    href={"https://x.com/catraHQ"}
                    className="font-extrabold underline"
                  >
                    @Catra
                  </Link>
                </p>
                <p className="text-sm text-muted-foreground">
                  This project is maintained by{" "}
                  <span className="text-primary">Catra</span>, a non-profit
                  organization dedicated to providing open-source projects for
                  developers. All our projects are free to use and open source.
                  Our goal is to enhance the development experience for
                  developers.
                  <Link
                    href={""}
                    target="_blank"
                    className="text-primary underline ml-1"
                  >
                    Learn more
                  </Link>
                </p>
              </div>
            </div>
          </HoverCardContent>
        </HoverCard>

        <div className="my-2" />

        {Items.map((item) => (
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
        ))}
      </div>

      <div className="m-2">
        <ThemeSwitcher />
        <div className="space-y-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="h-auto p-0 hover:bg-transparent"
              >
                <Avatar className="size-9">
                  <AvatarImage
                    src={`https://github.com/${user?.login}.png`}
                    alt={user?.login}
                  />
                  <AvatarFallback></AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="max-w-64 ml-2">
              <DropdownMenuLabel className="flex min-w-0 flex-col">
                <span className="truncate text-sm font-medium text-foreground">
                  {user?.name}
                </span>
                <span className="truncate text-xs font-normal text-muted-foreground">
                  {user?.login}                  
                </span>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  <Bolt
                    size={16}
                    strokeWidth={2}
                    className="opacity-60"
                    aria-hidden="true"
                  />
                  <span>Option 1</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Layers2
                    size={16}
                    strokeWidth={2}
                    className="opacity-60"
                    aria-hidden="true"
                  />
                  <span>Option 2</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <BookOpen
                    size={16}
                    strokeWidth={2}
                    className="opacity-60"
                    aria-hidden="true"
                  />
                  <span>Option 3</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  <Pin
                    size={16}
                    strokeWidth={2}
                    className="opacity-60"
                    aria-hidden="true"
                  />
                  <span>Option 4</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <UserPen
                    size={16}
                    strokeWidth={2}
                    className="opacity-60"
                    aria-hidden="true"
                  />
                  <span>Option 5</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive focus:text-destructive focus:bg-destructive/10">
                <LogOut
                  size={16}
                  strokeWidth={2}
                  className="opacity-60"
                  aria-hidden="true"
                />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;

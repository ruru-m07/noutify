import React from "react";

import Image from "next/image";
import Link from "next/link";

import { auth } from "@/auth";

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@noutify/ui/components/hover-card";

import Logo from "../logo";
import SideBarItems from "./items";
import AvatarDropdown from "./avatarDropdown";
import { Button } from "@noutify/ui/components/button";
import {
  BookMarked,
  CircleDot,
  FolderGit2,
  GitPullRequestArrow,
  Inbox,
  Plus,
  Settings,
  Star,
} from "lucide-react";
import { getGithubClient } from "@/lib/ghClient";

const Sidebar = async () => {
  const session = await auth();

  const ghClient = await getGithubClient();

  const rateLimit = await ghClient.rateLimit.getRateLimit();

  return (
    <div className="h-screen w-[--sidebar-width] flex flex-col justify-between items-center -mr-2">
      <div className="w-full m-2 mt-4 flex flex-col items-center">
        <HoverCard>
          <HoverCardTrigger>
            <Logo />
          </HoverCardTrigger>
          <CardContent />
        </HoverCard>

        <div className="flex flex-col items-center gap-1">
          <div className="my-1 h-px w-full" />
          <SideBarItems
            items={[
              {
                icon: Inbox,
                name: "Inbox",
                href: "/inbox",
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
              {
                icon: FolderGit2,
                name: "Local Git",
                href: "/git",
              },
            ]}
          />
          <div className="my-1 h-px w-full bg-border" />
          {/* // TODO: we will forward to do some kindof sortcuts */}
          {[
            "ruru-m07",
            "github",
            "supabase",
            "vercel",
            "shadcn",
            "shadcn-ui",
            "manuarora700",
            "aceternity",
            "oraczen",
          ].map((v, i) => (
            <Button key={i} variant="ghost" size={"icon"}>
              <Image
                src={`https://github.com/${v}.png`}
                alt="vercel"
                width={30}
                height={30}
                className="rounded-md"
              />
            </Button>
          ))}
          <Button variant="ghost" size={"icon"}>
            <Plus
              className="opacity-60"
              size={20}
              strokeWidth={2}
              aria-hidden="true"
            />
          </Button>
          <div className="my-1 h-px w-full bg-border" />
          <SideBarItems
            items={[
              {
                icon: Star,
                href: "/starred",
                name: "Starred",
              },
              {
                icon: BookMarked,
                href: "/repositories",
                name: "Repositories",
              },
              {
                icon: Settings,
                href: "/settings",
                name: "Settings",
              },
            ]}
          />
        </div>
      </div>

      <div className="m-2">
        <div className="space-y-2">
          <AvatarDropdown rateLimit={rateLimit} user={session?.user.profile} />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;

const CardContent = () => {
  return (
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
            By{" "}
            <Link
              target="_blank"
              href={"https://x.com/ruru_dev07"}
              className="font-extrabold underline"
            >
              @Ruru
            </Link>
          </p>
          <p className="text-sm text-muted-foreground">
            This project is maintained by{" "}
            <span className="inline-block">
              <Link
                href="https://github.com/ruru-m07"
                target="_blank"
                className="text-primary underline"
              >
                Ruru {" 😽 "}
              </Link>
            </span>
            . It is free to use and{" "}
            <span className="inline-block">
              <Link
                href="https://github.com/ruru-m07/noutify"
                target="_blank"
                className="text-primary underline"
              >
                open source ( ⭐ )
              </Link>
            </span>
            . If you like our projects, please consider{" "}
            <span className="inline-block">
              <Link
                href="https://github.com/sponsors/ruru-m07"
                target="_blank"
                className="text-primary underline"
              >
                supporting us 💝 :3
              </Link>
            </span>
          </p>
        </div>
      </div>
    </HoverCardContent>
  );
};

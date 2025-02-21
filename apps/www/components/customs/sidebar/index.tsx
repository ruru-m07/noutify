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

const Sidebar = async () => {
  const session = await auth();

  return (
    <div className="h-screen w-[--sidebar-width] flex flex-col justify-between items-center -mr-2">
      <div className="w-full m-2 mt-4 flex flex-col items-center">
        <HoverCard>
          <HoverCardTrigger>
            <Logo />
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

        <SideBarItems />
      </div>

      <div className="m-2">
        <div className="space-y-2">
          <AvatarDropdown user={session?.user.profile} />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;

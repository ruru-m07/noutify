// "use client";

import React from "react";

// import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@noutify/ui/components/tooltip";
import { buttonVariants } from "@noutify/ui/components/button";
// import { cn } from "@noutify/ui/lib/utils";
import { type LucideIcon } from "lucide-react";
import { cn } from "@noutify/ui/lib/utils";

type Item = {
  icon: LucideIcon;
  name: string;
  href: string;
};

const SideBarItems: React.FC<{
  items: Item[];
}> = ({ items }) => {
  // const pathname = usePathname();

  return items.map((item: Item) => (
    <div key={item.name}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link
            href={item.href}
            className={cn(buttonVariants({ variant: "ghost", size: "icon" }))}
            // className={cn(pathname === item.href && "bg-accent")}
            prefetch
          >
            <item.icon
              className="opacity-60"
              size={16}
              strokeWidth={2}
              aria-hidden="true"
            />
          </Link>
        </TooltipTrigger>
        <TooltipContent side="left" className="px-2 py-1 text-xs">
          {item.name}
        </TooltipContent>
      </Tooltip>
    </div>
  ));
};

export default SideBarItems;

"use client";

import React from "react";

import { LogOut } from "lucide-react";

import { Button } from "@noutify/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
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

import { signOutAction } from "@/actions/signOut";
import type { Profile } from "@/auth";
import ThemeDropDown from "./themeDropDown";

interface AvatarDropdownProps {
  user?: Profile;
}

const AvatarDropdown: React.FC<AvatarDropdownProps> = ({ user }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-auto p-0 hover:bg-transparent">
          <Avatar className="size-9">
            <AvatarImage src={user?.avatar_url} alt={user?.login} />
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
        <DropdownMenuLabel>Preferences</DropdownMenuLabel>

        <ThemeDropDown />

        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => signOutAction()}
          className="text-destructive focus:text-destructive focus:bg-destructive/10"
        >
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
  );
};

export default AvatarDropdown;

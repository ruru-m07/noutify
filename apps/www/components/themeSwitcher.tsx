"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@noutify/ui/components/dropdown-menu";
import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export default function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();

  const systemPreference = "dark";
  const displayTheme = theme === "system" ? systemPreference : theme;

  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger>
          {/* {displayTheme === "light" && (
            <Sun size={16} strokeWidth={2} aria-hidden="true" />
          )}
          {displayTheme === "dark" && (
            <Moon size={16} strokeWidth={2} aria-hidden="true" />
          )} */}
        </DropdownMenuTrigger>
        <DropdownMenuContent className="min-w-32">
          <DropdownMenuItem onClick={() => setTheme("light")}>
            <Sun
              size={16}
              strokeWidth={2}
              className="opacity-60"
              aria-hidden="true"
            />
            <span>Light</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTheme("dark")}>
            <Moon
              size={16}
              strokeWidth={2}
              className="opacity-60"
              aria-hidden="true"
            />
            <span>Dark</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTheme("system")}>
            <Monitor
              size={16}
              strokeWidth={2}
              className="opacity-60"
              aria-hidden="true"
            />
            <span>System</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

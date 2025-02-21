"use client";

import React from "react";

import { TooltipProvider } from "@noutify/ui/components/tooltip";

import { ThemeProvider } from "./theme";
import { AppStateProvider } from "./appState";
import { SessionProvider } from "next-auth/react";

const ContextProvider = React.forwardRef<
  HTMLDivElement,
  React.PropsWithChildren<{
    readonly children: React.ReactNode;
  }>
>(({ children }, ref) => {
  return (
    <div ref={ref}>
      <SessionProvider>
        <AppStateProvider>
          <ThemeProvider>
            <TooltipProvider delayDuration={0}>{children}</TooltipProvider>
          </ThemeProvider>
        </AppStateProvider>
      </SessionProvider>
    </div>
  );
});

ContextProvider.displayName = "ContextProvider";

export { ContextProvider };

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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    session: any;
  }>
>(({ children, session }, ref) => {
  return (
    <div ref={ref}>
      <SessionProvider
        refetchOnWindowFocus={false}
        refetchInterval={30000}
        session={session}
      >
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

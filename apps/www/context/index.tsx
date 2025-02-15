import React from "react";

import { TooltipProvider } from "@noutify/ui/components/tooltip";

import { ThemeProvider } from "./theme";
import { AppStateProvider } from "./appState";

const ContextProvider = React.forwardRef<
  HTMLDivElement,
  React.PropsWithChildren<{
    readonly children: React.ReactNode;
  }>
>(({ children }, ref) => {
  return (
    <div ref={ref}>
      <AppStateProvider>
        <ThemeProvider>
          <TooltipProvider delayDuration={0}>{children}</TooltipProvider>
        </ThemeProvider>
      </AppStateProvider>
    </div>
  );
});

ContextProvider.displayName = "ContextProvider";

export { ContextProvider };

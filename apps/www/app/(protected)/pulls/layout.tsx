import type React from "react";
import { auth } from "@/auth";
import { searchissuesandpullrequests } from "@noutify/functions/custom/api";
import { ScrollArea } from "@noutify/ui/components/scroll-area";
import PullRequestsList from "./pull-requests-list";

const PullsPage = async ({ children }: { children: React.ReactNode }) => {
  const session = await auth();

  const q = `sort:updated-desc is:pr author:${session.user.profile.login} archived:false`;

  const { items: pullRequests, total_count } =
    await searchissuesandpullrequests({
      q,
      per_page: "15",
      page: "1",
      token: session.user.accessToken,
    });

  return (
    <>
      <div className="w-[--inbox-width] border-r">
        <div className="h-[var(--top-nav-height)] border-b px-4 flex items-center justify-between bg-primary-foreground/75">
          <div>Pull Requests</div>
          <div></div>
        </div>
        {pullRequests && pullRequests.length > 0 && (
          <ScrollArea className="p-2 h-[calc(100vh-var(--top-nav-height))]">
            <PullRequestsList
              initialPullRequests={pullRequests}
              total_count={total_count}
              q={q}
            />
          </ScrollArea>
        )}
      </div>
      <div className="w-[calc(100vw-(var(--sidebar-width)+var(--inbox-width)+(var(--margin)*2))+3.5rem)]">
        {children}
      </div>
    </>
  );
};

export default PullsPage;

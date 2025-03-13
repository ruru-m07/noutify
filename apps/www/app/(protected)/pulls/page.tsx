import { auth } from "@/auth";
import PullRequestItem from "@/components/customs/pull/pullRequestItem";
import { getGithubClient } from "@/lib/ghClient";
import { ScrollArea } from "@noutify/ui/components/scroll-area";

const PullsPage = async () => {
  const ghClient = await getGithubClient();
  const session = await auth();

  const pullRequest = await ghClient.search.listUserPullRequests(
    session.user.profile.login,
    "is:open archived:false "
  );

  return (
    <>
      <div className="w-[--inbox-width] border-r">
        <div className="h-[var(--top-nav-height)] border-b px-4 flex items-center justify-between bg-primary-foreground/75">
          <div>Pull Requests</div>
          <div></div>
        </div>
        <ScrollArea className="p-2 h-[calc(100vh-var(--top-nav-height))]">
          {pullRequest &&
            pullRequest.map((pr, i) => (
              <PullRequestItem
                key={i}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                pr={pr as any}
                repositoryUrl={pr.repository_url}
                number={pr.number}
                title={pr.title}
              />
            ))}
          {/* // ? Empty space at bottom */}
          <div className="h-16" />
        </ScrollArea>
      </div>
      <div className="w-[calc(100vw-(var(--sidebar-width)+var(--inbox-width)+(var(--margin)*2))+3.5rem)]">
        {/* // TODO: will make a /pulls/vercel/next.js/11 */}
      </div>
    </>
  );
};

export default PullsPage;

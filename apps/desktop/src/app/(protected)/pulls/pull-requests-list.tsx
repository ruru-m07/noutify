"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@noutify/ui/components/button";
import PullRequestItem from "@/components/customs/pull/pullRequestItem";
import { loadMorePullRequests } from "@/actions/loadPullRequests";

import type { RestEndpointMethodTypes } from "@octokit/plugin-rest-endpoint-methods";
import { Input } from "@noutify/ui/components/input";
import { ArrowRightIcon, LoaderCircleIcon, SearchIcon } from "lucide-react";

import { motion, AnimatePresence } from "framer-motion";

export default function PullRequestsList({
  initialPullRequests,
  q,
  total_count,
}: {
  initialPullRequests: RestEndpointMethodTypes["search"]["issuesAndPullRequests"]["response"]["data"]["items"];
  q: string;
  total_count: number;
}) {
  const [page, setPage] = useState(1);
  const [pullRequests, setPullRequests] =
    useState<
      RestEndpointMethodTypes["search"]["issuesAndPullRequests"]["response"]["data"]["items"]
    >(initialPullRequests);
  const [isLoading, setIsLoading] = useState(false);

  const [searchQuery, setSearchQuery] = useState(q);
  const [value, setValue] = useState(q);
  const [loadingNewQuery, setLoadingNewQuery] = useState(false);

  const [totalCountState, setTotalCount] = useState(total_count);

  // Track if this is the initial load
  const isInitialLoad = useRef(true);

  // Track which items are newly added (for load more)
  const [newItemsIndices, setNewItemsIndices] = useState<number[]>([]);

  // For search transitions
  const [isSearching, setIsSearching] = useState(false);
  const [oldPullRequests, setOldPullRequests] = useState<typeof pullRequests>(
    []
  );

  useEffect(() => {
    // After first render, set initial load to false
    isInitialLoad.current = false;
  }, []);

  async function handleLoadMore() {
    setIsLoading(true);
    try {
      const result = await loadMorePullRequests(page + 1, searchQuery);
      const newItems =
        result.pullRequests as RestEndpointMethodTypes["search"]["issuesAndPullRequests"]["response"]["data"]["items"];

      // Track the indices of new items for animation
      const currentLength = pullRequests.length;
      const newIndices = Array.from(
        { length: newItems.length },
        (_, i) => i + currentLength
      );
      setNewItemsIndices(newIndices);

      setPullRequests([...pullRequests, ...newItems]);
      setPage(result.nextPage);
      setTotalCount(result.total_count);
    } finally {
      setIsLoading(false);
    }
  }

  const handleSearch = async (query: string) => {
    if (query === searchQuery) return;

    setLoadingNewQuery(true);
    setIsSearching(true);

    // Store old pull requests for exit animation
    setOldPullRequests(pullRequests);

    // Clear new items indices when searching
    setNewItemsIndices([]);

    try {
      const result = await loadMorePullRequests(1, query);
      setPullRequests(
        result.pullRequests as RestEndpointMethodTypes["search"]["issuesAndPullRequests"]["response"]["data"]["items"]
      );
      setPage(result.nextPage);
      setTotalCount(result.total_count);
      setSearchQuery(query);
    } finally {
      setLoadingNewQuery(false);
      // Immediately set isSearching to false to prevent animations on pull items
      setIsSearching(false);
    }
  };

  // Animation variants for each item
  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 20,
      filter: "blur(8px)",
    },
    show: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        type: "spring",
        stiffness: 260,
        damping: 20,
      },
    },
    exit: {
      opacity: 0,
      y: -20,
      filter: "blur(8px)",
      transition: {
        duration: 0.3,
      },
    },
  };

  return (
    <>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSearch(value);
        }}
        className="relative p-4 flex items-center gap-2"
      >
        <Input
          id={"search query"}
          className="peer ps-9"
          placeholder="Search..."
          type="search"
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
          }}
        />
        <div className="text-muted-foreground/80 ml-4 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
          <SearchIcon size={16} />
        </div>
        <Button
          variant={"outline"}
          className="px-2"
          size={"icon"}
          type="submit"
        >
          <ArrowRightIcon size={16} />
        </Button>
      </form>

      <AnimatePresence>
        {loadingNewQuery && (
          <motion.div
            key="loader"
            initial={{ opacity: 0, height: 0, filter: "blur(0px)" }}
            animate={{
              opacity: 1,
              height: "40px",
              filter: "blur(0px)",
            }}
            exit={{
              opacity: 0,
              height: 0,
              filter: "blur(3px)",
            }}
            transition={{
              duration: 0.4,
              ease: "easeInOut",
            }}
            className="flex justify-center items-center overflow-hidden"
          >
            <motion.div
              initial={{ scale: 0.6 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.6 }}
              transition={{ duration: 0.3 }}
            >
              <LoaderCircleIcon
                className="animate-spin"
                size={18}
                aria-hidden="true"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {isSearching ? (
          <div key="old-results" className="space-y-1">
            {oldPullRequests.map((pr, i) => (
              <div key={`old-${pr.id}-${i}`}>
                <PullRequestItem
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  pr={pr as any}
                  repositoryUrl={pr.repository_url}
                  number={pr.number}
                  title={pr.title}
                />
              </div>
            ))}
          </div>
        ) : (
          <motion.div key="current-results" className="space-y-1">
            {pullRequests.map((pr, i) => (
              <motion.div
                key={`${pr.id}-${i}`}
                initial={
                  isInitialLoad.current || !newItemsIndices.includes(i)
                    ? false
                    : "hidden"
                }
                animate={isInitialLoad.current ? {} : "show"}
                variants={itemVariants}
                layout
              >
                <PullRequestItem
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  pr={pr as any}
                  repositoryUrl={pr.repository_url}
                  number={pr.number}
                  title={pr.title}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {pullRequests.length < totalCountState && (
        <motion.div
          initial={isInitialLoad.current ? false : { opacity: 0, y: 10 }}
          animate={isInitialLoad.current ? {} : { opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex justify-center items-center mt-5"
        >
          <Button
            variant="outline"
            onClick={handleLoadMore}
            disabled={isLoading}
          >
            {isLoading && (
              <LoaderCircleIcon
                className="-ms-1 mr-2 animate-spin"
                size={16}
                aria-hidden="true"
              />
            )}
            <span className="flex items-baseline gap-2">
              Load More
              <span className="text-muted-foreground text-xs">
                {pullRequests.length}/{totalCountState}
              </span>
            </span>
          </Button>
        </motion.div>
      )}
      <div className="h-10" />
    </>
  );
}

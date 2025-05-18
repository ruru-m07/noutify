"use client";

import React, { useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  CircleAlert,
  CircleCheckIcon,
  EyeIcon,
  EyeOffIcon,
  LoaderCircleIcon,
  LogOut,
  TriangleAlert,
} from "lucide-react";

import { Button, buttonVariants } from "@noutify/ui/components/button";
import { Input } from "@noutify/ui/components/input";
import { Separator } from "@noutify/ui/components/separator";

import { H3, Muted } from "@/components/typography";
import Link from "next/link";
import { cn } from "@noutify/ui/lib/utils";
import type { Session } from "next-auth";
import { GENERATE_GITHUB_TOKEN_URL } from "@/lib/constant";
import { signOutAction } from "@/actions/signOut";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@noutify/ui/components/tooltip";
import { setTokenAction } from "@/actions/setToken";

const TokenCard = ({ session }: { session: Session }) => {
  const [token, setToken] = useState("");
  const [isVisible, setIsVisible] = useState<boolean>(false);

  const [error, setError] = useState<string | null>(null);
  const [warning, setWarning] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);

  const toggleVisibility = () => setIsVisible((prevState) => !prevState);

  return (
    <>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setError(null);
          setWarning(null);
          setLoading(true);
          (async () => {
            const result = await setTokenAction({ token });
            
            if (result?.error) {
              setError(result.error);
            }
            if (result?.warning) {
              setWarning(result.warning);
            }
            if (result && !result.error && !result.warning) {
              setSuccess("Token set successfully. Redirecting...");
            }
            setLoading(false);
            setToken("");
          })();
          return false; // Prevent form submission
        }}
        className="flex flex-col items-center justify-center h-screen"
        autoComplete="off"
      >
        <div className="border bg-accent/50 text-card-foreground shadow w-96 p-4 gap-4 flex flex-col rounded-3xl">
          <div>
            <Tooltip>
              <TooltipTrigger asChild>
                <H3 className="text-center">Welcome {session.user.name} !</H3>
              </TooltipTrigger>
              <TooltipContent className="px-2 py-1 text-xs">
                Hello {session.user.profile.login}!
              </TooltipContent>
            </Tooltip>

            <Muted className="text-center">
              Please provide your GitHub token.
            </Muted>
          </div>
          <Link
            href={GENERATE_GITHUB_TOKEN_URL}
            target="_blank"
            className={cn(
              buttonVariants({
                variant: "link",
                size: "lg",
              }),
              "w-full group gap-2"
            )}
          >
            Generate Token
            <ArrowUpRight size={16} strokeWidth={2} aria-hidden="true" />
          </Link>
          {error && (
            <div className="rounded-lg border border-destructive/20 px-4 py-3 text-destructive bg-destructive/5">
              <p className="flex text-sm items-start">
                <CircleAlert
                  className="me-3 mt-1 inline-flex opacity-60"
                  size={16}
                  aria-hidden="true"
                />
                <span className="w-full">{error}</span>
              </p>
            </div>
          )}
          {warning && (
            <div className="rounded-lg border border-yellow-500/20 px-4 py-3 text-yellow-600 bg-yellow-500/5">
              <p className="flex text-sm items-start">
                <TriangleAlert
                  className="me-3 mt-1 inline-flex opacity-60"
                  size={16}
                  aria-hidden="true"
                />
                <span className="w-full">{warning}</span>
              </p>
            </div>
          )}
          {success && (
            <div className="rounded-lg border border-green-500/20 px-4 py-3 text-green-500 bg-green-500/5">
              <p className="flex text-sm items-start">
                <CircleCheckIcon
                  className="me-3 mt-1 inline-flex opacity-60"
                  size={16}
                  aria-hidden="true"
                />
                <span className="w-full">{success}</span>
              </p>
            </div>
          )}
          <div className="*:not-first:mt-2">
            <div className="relative">
              <Input
                className="pe-9"
                placeholder="ghp_gZk2ZqcLxxxx"
                type={isVisible ? "text" : "password"}
                value={token}
                onChange={(e) => setToken(e.target.value)}
                aria-describedby={`description-description`}
                autoComplete="new-password"
              />
              <button
                className="text-muted-foreground/80 hover:text-foreground outline-ring/30 dark:outline-ring/40 absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-lg outline-offset-2 transition-colors focus:z-10 focus-visible:outline-2 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                type="button"
                onClick={toggleVisibility}
                aria-label={isVisible ? "Hide password" : "Show password"}
                aria-pressed={isVisible}
                aria-controls="password"
              >
                {isVisible ? (
                  <EyeOffIcon size={16} aria-hidden="true" />
                ) : (
                  <EyeIcon size={16} aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
          <Button
            className="w-full font-semibold text-sm group"
            size={"sm"}
            type="submit"
            disabled={token.length < 7 || loading}
          >
            {loading && (
              <LoaderCircleIcon
                className="-ms-1 animate-spin mr-2"
                size={16}
                aria-hidden="true"
              />
            )}
            Submit
            <ArrowRight
              className="-me-1 ms-2 opacity-60 transition-transform group-hover:translate-x-0.5"
              size={16}
              strokeWidth={2}
              aria-hidden="true"
            />
          </Button>

          <Separator />

          <Button
            className="w-full text-sm group text-destructive focus:text-destructive bg-destructive/10 hover:bg-destructive/25"
            variant={"destructive"}
            size={"sm"}
            onClick={() => signOutAction()}
            disabled={loading}
          >
            LogOut
            <LogOut
              className="-me-1 ms-2 opacity-60 transition-transform group-hover:translate-x-0.5"
              size={16}
              strokeWidth={2}
              aria-hidden="true"
            />
          </Button>
        </div>
      </form>
    </>
  );
};

export default TokenCard;

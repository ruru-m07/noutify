"use client";

import React from "react";

import { CheckIcon, CircleCheckIcon, XIcon } from "lucide-react";
import { Muted } from "@/components/typography";
import { Label } from "@noutify/ui/components/label";
import { Button } from "@noutify/ui/components/button";
import { getUpStreamURL } from "@/actions/getUpStream";
import { getServerPort } from "@/actions/getServerPort";

import { Toaster, toast } from "sonner";
import { storeTempCode } from "@/actions/storeTempCode";
import { poolTempUser } from "@/actions/poolTempUser";
import { createSession } from "@/actions/createSession";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [code, setCode] = React.useState<string | null>(null);

  const [copied, setCopied] = React.useState(false);
  const [isPolling, setIsPolling] = React.useState(false);
  const [isAuthorized, setIsAuthorized] = React.useState(false);
  const [streamURL, setStreamURL] = React.useState<string | null>(null);
  const [port, setPort] = React.useState<string | null>(null);

  const pollingRef = React.useRef(false);
  const pollingIntervalRef = React.useRef<NodeJS.Timeout | null>(null);

  React.useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [streamURLResult, portResult, codeResult] = await Promise.all([
          getUpStreamURL(),
          getServerPort(),
          storeTempCode(),
        ]);

        setStreamURL(streamURLResult);
        setPort(portResult.port as string);
        setCode(codeResult.code);

        if (codeResult.code) {
          setIsPolling(true);
          pollingRef.current = true;
          startPolling();
        }
      } catch (error) {
        console.error("Error fetching initial data:", error);
      }
    };

    fetchInitialData();

    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
      }
      pollingRef.current = false;
      setIsPolling(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startPolling = () => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
    }

    pollingIntervalRef.current = setInterval(async () => {
      if (!pollingRef.current) {
        if (pollingIntervalRef.current) {
          clearInterval(pollingIntervalRef.current);
          pollingIntervalRef.current = null;
        }
        return;
      }

      try {
        const user = await poolTempUser();

        if (user && user.success === true) {
          if (pollingIntervalRef.current) {
            clearInterval(pollingIntervalRef.current);
            pollingIntervalRef.current = null;
          }
          pollingRef.current = false;
          setIsPolling(false);
          setIsAuthorized(true);

          if (user.user.user) {
            await createSession({ user: user.user.user });
            setTimeout(() => {
              router.push("/auth/token");
            }, 500);
          }
        }
      } catch (error) {
        console.error("Error polling user:", error);
      }
    }, 1000);
  };

  const copyToClipboard = () => {
    if (code) {
      navigator.clipboard.writeText(code).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    }
  };

  const firstPart = code?.slice(0, 3);
  const secondPart = code?.slice(3);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="border bg-accent/50 text-card-foreground shadow p-5 gap-7 flex flex-col rounded-3xl justify-center items-center">
        <h4 className="text-xl font-semibold text-primary">
          Authorize device via web app.
        </h4>

        {isPolling && !isAuthorized && (
          <div className="flex items-center gap-2">
            <span className="text-lg text-muted-foreground">
              Waiting for authorization...
            </span>
            <svg
              className="h-4 w-4 text-green-500 scale-125"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                fill="none"
                strokeWidth="4"
                stroke="currentColor"
              />
              <path
                className="animate-pulse"
                fill="currentColor"
                d="M4 12a8 8 0 1 1 16 0A8 8 0 0 1 4 12z"
              />
            </svg>
          </div>
        )}
        <div
          className="rounded-xl bg-card p-6 border shadow-sm relative cursor-pointer group"
          onClick={copyToClipboard}
        >
          <div className="flex items-center justify-center gap-2">
            {firstPart?.split("").map((digit, index) => (
              <div
                key={`first-${index}`}
                className="flex px-6 items-center justify-center w-10 h-12 rounded-md bg-accent/50 border text-3xl font-bold text-primary"
              >
                {digit}
              </div>
            ))}

            <div className="h-1 w-4 bg-border mx-1 rounded-full"></div>

            {secondPart?.split("").map((digit, index) => (
              <div
                key={`second-${index}`}
                className="flex px-6 items-center justify-center w-10 h-12 rounded-md bg-accent/50 border text-3xl font-bold text-primary"
              >
                {digit}
              </div>
            ))}
          </div>

          <div
            className={`absolute -top-2 -right-2 transition-opacity duration-200 ${copied ? "opacity-100" : "opacity-0"}`}
          >
            <div className="bg-green-950 border border-green-700 text-green-700 text-xs rounded-full px-2 py-1 flex items-center">
              <CheckIcon className="h-3 w-3 mr-1" />
              Copied
            </div>
          </div>

          <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-xl flex items-center justify-center">
            <span className="text-xs font-medium text-primary/70">
              Click to copy
            </span>
          </div>
        </div>
        {isAuthorized && (
          <div className="text-sm text-green-500">Authorized successfully!</div>
        )}
        <div className="flex flex-col items-center gap-1">
          <Muted className="text-sm text-muted-foreground">
            <Label
              htmlFor="deviceId"
              className="text-muted-foreground text-sm text-center"
            >
              Can&apos;t open link?{" "}
              <span
                onClick={() => {
                  if (streamURL && port) {
                    window.navigator.clipboard.writeText(
                      `${streamURL}/auth/device?port=${port}`
                    );
                    toast.custom((t) => (
                      <div className="bg-background text-foreground w-full rounded-md border px-4 py-3 shadow-lg sm:w-[var(--width)]">
                        <div className="flex gap-2">
                          <div className="flex grow gap-3">
                            <CircleCheckIcon
                              className="mt-0.5 shrink-0 text-emerald-500"
                              size={16}
                              aria-hidden="true"
                            />
                            <div className="flex grow justify-between gap-12">
                              <p className="text-sm">Copied to clipboard!</p>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            className="group -my-1.5 -me-2 size-8 shrink-0 p-0 hover:bg-transparent"
                            onClick={() => toast.dismiss(t)}
                            aria-label="Close banner"
                          >
                            <XIcon
                              size={16}
                              className="opacity-60 transition-opacity group-hover:opacity-100"
                              aria-hidden="true"
                            />
                          </Button>
                        </div>
                      </div>
                    ));
                  }
                }}
                className="underline cursor-pointer"
              >
                Copy to clipboard
              </span>
            </Label>
          </Muted>
        </div>
      </div>
      <Toaster />
    </div>
  );
}

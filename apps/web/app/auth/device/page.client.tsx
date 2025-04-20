"use client";

import React, { useState } from "react";

import { Button } from "@noutify/ui/components/button";
import Logo from "@/components/customs/logo";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@noutify/ui/components/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@noutify/ui/components/tooltip";
import { CheckIcon, LoaderCircleIcon, TriangleAlert, X } from "lucide-react";
import { authorizeDeviceAction } from "@/actions/AuthorizeDevice";
import { H4 } from "@/components/typography";

const PageClient = ({
  deviceId,
  session,
}: {
  deviceId: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  session: any;
}) => {
  const [code, setCode] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handelOnSubmit = async () => {
    setLoading(true);
    try {
      const { code, error: actionError } =
        await authorizeDeviceAction(deviceId);

      if (actionError) {
        setError(actionError);
        return;
      }

      if (code) {
        setCode(code);
      }
    } catch (error) {
      console.error("Error authorizing device:", error);
      setError("An error occurred while authorizing the device.");
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="border bg-destructive/10 text-card-foreground shadow border-destructive px-10 gap-8 flex flex-col rounded-3xl justify-center items-center py-10">
          <TriangleAlert
            size={60}
            strokeWidth={1.75}
            className="text-destructive"
          />
          <H4 className="text-destructive">{error}</H4>
        </div>
      </div>
    );
  }

  if (code) {
    const copyToClipboard = () => {
      navigator.clipboard.writeText(code).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    };
    const firstPart = code.slice(0, 3);
    const secondPart = code.slice(3);
    return (
      <div className="border bg-accent/50 text-card-foreground shadow px-10 gap-7 flex flex-col rounded-3xl justify-center items-center py-10">
        <div
          className="rounded-xl bg-card p-6 border shadow-sm relative cursor-pointer group"
          onClick={copyToClipboard}
        >
          <div className="flex items-center justify-center gap-2">
            {firstPart.split("").map((digit, index) => (
              <div
                key={`first-${index}`}
                className="flex px-6 items-center justify-center w-10 h-12 rounded-md bg-accent/50 border text-3xl font-bold text-primary"
              >
                {digit}
              </div>
            ))}

            <div className="h-1 w-4 bg-border mx-1 rounded-full"></div>

            {secondPart.split("").map((digit, index) => (
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

        <div className="flex flex-col items-center gap-1">
          <h4 className="text-xl font-semibold text-primary">
            Device authorized successfully!
          </h4>
          <p className="text-sm text-muted-foreground">
            You can now continue on your device
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="border bg-accent/50 text-card-foreground shadow w-96 p-4 gap-4 flex flex-col rounded-3xl">
      <div className="w-full flex justify-center items-center ">
        <div className="relative">
          <Avatar className="border scale-125">
            <AvatarImage
              src={session.user.profile.avatar_url}
              alt="Kelly King"
            />
            <AvatarFallback> </AvatarFallback>
          </Avatar>

          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="absolute -end-1.5 -top-1.5">
                  <span className="sr-only">Verified</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      className="fill-background"
                      d="M3.046 8.277A4.402 4.402 0 0 1 8.303 3.03a4.4 4.4 0 0 1 7.411 0 4.397 4.397 0 0 1 5.19 3.068c.207.713.23 1.466.067 2.19a4.4 4.4 0 0 1 0 7.415 4.403 4.403 0 0 1-3.06 5.187 4.398 4.398 0 0 1-2.186.072 4.398 4.398 0 0 1-7.422 0 4.398 4.398 0 0 1-5.257-5.248 4.4 4.4 0 0 1 0-7.437Z"
                    />
                    <path
                      className="fill-primary"
                      d="M4.674 8.954a3.602 3.602 0 0 1 4.301-4.293 3.6 3.6 0 0 1 6.064 0 3.598 3.598 0 0 1 4.3 4.302 3.6 3.6 0 0 1 0 6.067 3.6 3.6 0 0 1-4.29 4.302 3.6 3.6 0 0 1-6.074 0 3.598 3.598 0 0 1-4.3-4.293 3.6 3.6 0 0 1 0-6.085Z"
                    />
                    <path
                      className="fill-background"
                      d="M15.707 9.293a1 1 0 0 1 0 1.414l-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 1 1 1.414-1.414L11 12.586l3.293-3.293a1 1 0 0 1 1.414 0Z"
                    />
                  </svg>
                </span>
              </TooltipTrigger>
              <TooltipContent
                className="dark px-2 py-1 text-xs"
                showArrow={true}
              >
                Hey {session.user.name}!
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <X className="ml-4 text-primary/80" size={24} />
        <Logo size={83} />
      </div>
      <Button className="w-full" disabled={loading} onClick={handelOnSubmit}>
        {loading && (
          <LoaderCircleIcon
            className="-ms-1 animate-spin mr-2"
            size={16}
            aria-hidden="true"
          />
        )}
        Authorize Device
      </Button>
    </div>
  );
};

export default PageClient;

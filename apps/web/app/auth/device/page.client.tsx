"use client";

import React, { useId, useState } from "react";

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
import { LoaderCircleIcon, TriangleAlert, X } from "lucide-react";
import type { SlotProps } from "input-otp";
import { OTPInput } from "input-otp";

import { H4 } from "@/components/typography";

import { cn } from "@noutify/ui/lib/utils";
import { sendSession } from "@/actions/sendSession";

const PageClient = ({
  port,
  session,
}: {
  port: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  session: any;
}) => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = React.useState<string | null>(null);

  const [message, setMessage] = useState<string | null>(null);

  const id = useId();

  const handelOnSubmit = async (otp: string) => {
    setLoading(true);
    setError(null);

    try {
      // ? check the valid otp or not.
      const res = await fetch(
        `http://localhost:${port}/api/auth/auth-callback`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            code: otp,
          }),
        }
      );

      const data = await res.json();

      if (data.success) {
        const { data } = await sendSession({ port });
        if (data.success) {
          setMessage("Device authorized successfully");
          setTimeout(() => {
            window.close();
          }, 3000);
        }
      }
    } catch (error) {
      console.log(error);
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

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="border bg-accent/50 text-card-foreground shadow w-96 gap-2 flex flex-col rounded-3xl">
        <div className="w-full flex border-b py-2 justify-center items-center ">
          <div className="relative">
            <Avatar className="border size-14">
              <AvatarImage
                src={session.user.profile.avatar_url}
                alt="Kelly King"
              />
              <AvatarFallback> </AvatarFallback>
            </Avatar>

            <TooltipProvider delayDuration={0}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="absolute -end-0.5 -top-0.5">
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
          <Logo size={80} />
        </div>

        <div className="flex w-full items-center mt-2 justify-center">
          <H4>Enter your verification code</H4>
        </div>

        <div className="items-center justify-center w-full px-4 text-card-foreground py-4 gap-4 flex flex-col">
          <div className="*:not-first:mt-2">
            <OTPInput
              id={id}
              containerClassName="flex items-center gap-8 has-disabled:opacity-50"
              maxLength={6}
              render={({ slots }) => (
                <>
                  <div className="flex gap-3">
                    {slots.slice(0, 3).map((slot, idx) => (
                      <Slot key={idx} {...slot} />
                    ))}
                  </div>
                  <div className="h-1 w-4 bg-border mx-1 rounded-full"></div>
                  <div className="flex gap-3">
                    {slots.slice(3).map((slot, idx) => (
                      <Slot key={idx} {...slot} />
                    ))}
                  </div>
                </>
              )}
              onChange={(newValue) => {
                setOtp(newValue);
              }}
            />
          </div>
          {error && (
            <div className="w-full mx-2 rounded-md border border-destructive bg-destructive/15 p-2 text-sm text-destructive flex justify-center items-center">
              {error}
            </div>
          )}
        </div>

        {message && (
          <div className="flex w-full items-center justify-center mb-3">
            <div className="w-full py-3 px-2 mx-4 rounded-md border border-green-500 text-green-500 flex justify-center items-center bg-green-500/10">
              {message}
            </div>
          </div>
        )}

        <div className="px-4 pb-4">
          <Button
            onClick={() => {
              handelOnSubmit(otp as string);
            }}
            className="w-full"
            disabled={loading}
          >
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
      </div>
    </div>
  );
};

export default PageClient;

function Slot(props: SlotProps) {
  return (
    <div
      className={cn(
        "border-input bg-background text-foreground relative -ms-px flex size-9 items-center justify-center border font-medium shadow-xs transition-[color,box-shadow] first:ms-0 first:rounded-s-md last:rounded-e-md",
        { "border-ring ring-ring/50 z-10 ring-[3px]": props.isActive }
      )}
    >
      {props.char !== null && <div>{props.char}</div>}
    </div>
  );
}

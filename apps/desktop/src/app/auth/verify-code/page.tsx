"use client";

import React, { useId } from "react";

import type { SlotProps } from "input-otp";
import { OTPInput } from "input-otp";

import { Label } from "@noutify/ui/components/label";
import { cn } from "@noutify/ui/lib/utils";
import { H4, Muted } from "@/components/typography";
import { Button } from "@noutify/ui/components/button";

import { toast, Toaster } from "sonner";
import { CircleCheckIcon, LoaderCircleIcon, XIcon } from "lucide-react";
import { createSession } from "@/actions/createSession";
import { useRouter } from "next/navigation";
import { getUpStreamURL } from "@/actions/getUpStream";

export default function LoginPage() {
  const [deviceId, setDeviceId] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [otp, setOtp] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [streamURL, setStreamURL] = React.useState<string | null>(null);

  const router = useRouter();

  React.useEffect(() => {
    (async () => {
      try {
        const response = await fetch("/api/fingerprint");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.text();
        setDeviceId(data);
      } catch (error) {
        console.error("Error fetching device ID:", error);
      }
    })();
    (async () => {
      const streamURL = await getUpStreamURL();
      setStreamURL(streamURL);
    })();
  }, []);

  const handelOnSubmit = async (otp: string) => {
    setLoading(true);
    setError(null);

    try {
      if (!deviceId) {
        console.error("Device ID is null");
        return;
      }

      const response = await fetch(`${streamURL}/api/auth/verify-code`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          deviceId: deviceId,
          code: otp,
        }),
      });

      const jsonResponse: {
        success: boolean;
        error?: string;
        data?: unknown;
      } = await response.json();

      if (jsonResponse.error) {
        setError(jsonResponse.error);
        return;
      }

      if (!jsonResponse.success) {
        setError("Invalid code, device ID or might be expired");
        return;
      }

      if (jsonResponse.data) {
        console.log({
          response,
          jsonResponse,
        });
        const { success } = await createSession({
          // session: (jsonResponse.data as { session?: unknown })?.session || {},
          code: (jsonResponse.data as { code?: string }).code || "",
          deviceId: deviceId,
        });
        if (!success) {
          setError("Failed to create session");
          return;
        }

        router.push("/");
      }
    } catch (error) {
      console.error("Error authorizing device:", error);
    } finally {
      setLoading(false);
    }
  };

  const id = useId();

  return (
    <>
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="items-center justify-center border bg-accent/50 text-card-foreground shadow w-96 p-4 gap-4 flex flex-col rounded-3xl">
          <H4>Enter your verification code</H4>
          <div className="*:not-first:mt-2">
            <OTPInput
              id={id}
              containerClassName="flex items-center gap-3 has-disabled:opacity-50"
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
          <Button
            className="w-full"
            disabled={otp?.length !== 6 || loading}
            onClick={() => otp && handelOnSubmit(otp)}
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
          {error && (
            <div className="w-full mx-2 rounded-md border border-destructive bg-destructive/15 p-2 text-sm text-destructive flex justify-center items-center">
              {error}
            </div>
          )}
          <Muted>
            <Label
              htmlFor={id}
              className="text-muted-foreground text-sm text-center"
            >
              Can&apos;t open link?{" "}
              <span
                onClick={() => {
                  window.navigator.clipboard.writeText(
                    `${streamURL}/auth/device?deviceId=${deviceId}`
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
                }}
                className="underline cursor-pointer"
              >
                Copy to clipboard
              </span>
            </Label>
          </Muted>
        </div>
        <Toaster />
      </div>
    </>
  );
}

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

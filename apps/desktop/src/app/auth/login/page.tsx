"use client";

import React from "react";
import { ArrowRight, EarthLock } from "lucide-react";

import { Button } from "@noutify/ui/components/button";

import { useRouter } from "next/navigation";
import { Muted } from "@/components/typography";

export default function LoginPage() {
  const [deviceId, setDeviceId] = React.useState<string | null>(null);

  const router = useRouter();

  React.useEffect(() => {
    const fetchDeviceId = async () => {
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
    };

    fetchDeviceId();
  }, []);

  return (
    <>
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="border bg-accent/50 text-card-foreground shadow w-96 p-4 gap-4 flex flex-col rounded-3xl">
          <div className="w-full flex justify-center items-center">
            {/* <Logo size={83} />
            <X className="mr-4 text-primary/80" size={24} />
            <GitHubLogoIcon className="me-3 size-12" aria-hidden="true" />
             */}
            <EarthLock size={36} strokeWidth={1.5} />
          </div>
          <Muted className="w-full flex justify-center items-center">
            Authorizing your device via the web app.
          </Muted>
          <Button
            className="w-full group"
            type="submit"
            onClick={() => {
              window.electron.openExternal(
                `http://localhost:3001/auth/device?deviceId=${deviceId}`
              );
              router.push("/auth/verify-code");
            }}
          >
            Continue web login
            <ArrowRight
              className="-me-1 ms-2 opacity-60 transition-transform group-hover:translate-x-0.5"
              size={16}
              strokeWidth={2}
              aria-hidden="true"
            />
          </Button>
          <Muted className="w-full flex justify-center items-center -my-[9px] py-0 text-xs">
            A 6-digit code will verify it.
          </Muted>
        </div>
      </div>
    </>
  );
}

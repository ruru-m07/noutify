import { auth } from "@/auth";

import { TriangleAlert } from "lucide-react";
import { redirect } from "next/navigation";
import React from "react";
import PageClient from "./page.client";
import { H4 } from "@/components/typography";

const DevicePage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) => {
  const { deviceId } = await searchParams;
  const session = await auth();

  if (!session) {
    redirect("/auth/login");
  }

  if (!deviceId) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="border bg-amber-500/10 text-card-foreground shadow border-amber-500 px-10 gap-8 flex flex-col rounded-3xl justify-center items-center py-10">
          <TriangleAlert
            size={60}
            strokeWidth={1.75}
            className="text-amber-500"
          />
          <H4 className="text-amber-500">
            Device ID is missing. Please try again.
          </H4>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <PageClient session={session} deviceId={deviceId} />
    </div>
  );
};

export default DevicePage;

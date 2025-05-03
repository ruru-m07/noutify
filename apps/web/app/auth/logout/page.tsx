import LogoutButton from "@/app/logout.client";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import React from "react";

const LogoutPage = async () => {
  const session = await auth();

  if (!session) {
    redirect("/auth/login");
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="w-fit">
        <LogoutButton />
      </div>
    </div>
  );
};

export default LogoutPage;

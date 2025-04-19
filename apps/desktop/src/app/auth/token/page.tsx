import React from "react";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import TokenCard from "./tokenCard";

export default async function TokenPage() {
  const session = await auth();

  // if (!session) {
  //   redirect("/auth/login");
  // }

  // if (session && session.user.accessToken) {
  //   redirect("/");
  // }

  return (
    <>
      {/* <TokenCard session={session} /> */}
    </>
  );
}

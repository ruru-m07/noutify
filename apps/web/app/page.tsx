import { auth } from "@/auth";
import Home from "@/components/pages/home";
import React from "react";
import LogoutButton from "./logout.client";
import { redirect } from "next/navigation";

const Page = async () => {
  const session = await auth();

  if (session && !session.user.accessToken) {
    redirect("/auth/token");
  }
  
  return (
    <>
      <Home />
      <LogoutButton />
    </>
  );
};

export default Page;

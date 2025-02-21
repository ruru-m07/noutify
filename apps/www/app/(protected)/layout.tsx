import type React from "react";
import type { Metadata } from "next";

import { auth } from "@/auth";

import Sidebar from "@/components/customs/sidebar";
import Home from "@/components/pages/home";
import { redirect } from "next/navigation";

const defaultMetadata = {
  title: "Noutify",
  description: "Welcome to Noutify, your personal notification manager.",
} satisfies Metadata;

const authenticatedMetadata = {
  title: "Inbox • Noutify",
  description: "Manage your notifications efficiently with Noutify.",
} satisfies Metadata;

export async function generateMetadata(): Promise<Metadata> {
  const session = await auth();

  return session ? authenticatedMetadata : defaultMetadata;
}

export default async function ProtectedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  if (!session) {
    return <Home />;
  }

  if (session && !session.user.accessToken) {
    redirect("/auth/token");
  }

  return (
    <div className="flex [--sidebar-width:4rem]">
      <Sidebar />
      <div className="[--margin:0.7rem] [--inbox-width:23rem] [--top-nav-height:3rem] m-[var(--margin)] bg-accent/35 border w-full h-[calc(100vh-var(--margin)*2)] rounded-md overflow-hidden flex">
        {children}
      </div>
    </div>
  );
}

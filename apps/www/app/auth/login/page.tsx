import React from "react";
import { redirect } from "next/navigation";
import { GitHubLogoIcon } from "@radix-ui/react-icons";
import { ArrowRight, X } from "lucide-react";

import { Button } from "@noutify/ui/components/button";

import { auth, signIn } from "@/auth";
import Logo from "@/components/customs/logo";

export default async function LoginPage() {
  const session = await auth();
  
  if (session) {
    redirect("/");
  }

  return (
    <>
      <form
        action={async () => {
          "use server";
          await signIn("github", {
            redirectTo: "/",
          });
        }}
        className="flex flex-col items-center justify-center h-screen"
      >
        <div className="border bg-accent/50 text-card-foreground shadow w-96 p-4 gap-4 flex flex-col rounded-3xl">
          <div className="w-full flex justify-center items-center ">
            <Logo size={83} />
            <X className="mr-4 text-primary/80" size={24} />
            <GitHubLogoIcon className="me-3 size-12" aria-hidden="true" />
          </div>
          <Button
            className="w-full group"
            variant="outline"
            size={"lg"}
            type="submit"
          >
            Continue with GitHub
            <ArrowRight
              className="-me-1 ms-2 opacity-60 transition-transform group-hover:translate-x-0.5"
              size={16}
              strokeWidth={2}
              aria-hidden="true"
            />
          </Button>
        </div>
      </form>
    </>
  );
}

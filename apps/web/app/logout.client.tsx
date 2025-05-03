"use client";

import { signOutAction } from "@/actions/signOut";
import { Button } from "@noutify/ui/components/button";
import { LogOut } from "lucide-react";
import React from "react";

const LogoutButton = ({ loading = false }: { loading?: boolean }) => {
  return (
    <>
      <Button
        className="w-full text-sm group text-destructive focus:text-destructive bg-destructive/10 hover:bg-destructive/25"
        variant={"destructive"}
        size={"sm"}
        onClick={() => signOutAction()}
        disabled={loading}
      >
        LogOut
        <LogOut
          className="-me-1 ms-2 opacity-60 transition-transform group-hover:translate-x-0.5"
          size={16}
          strokeWidth={2}
          aria-hidden="true"
        />
      </Button>
    </>
  );
};

export default LogoutButton;

"use server";

import { signOut } from "@/auth";
import { log } from "@/lib/logger";

export async function signOutAction() {
  log.info("[signOutAction]: Signing out...");
  await signOut({
    redirectTo: "/auth/login",
  });
}

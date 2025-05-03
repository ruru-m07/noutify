"use server";

import fs from "fs";

import type { User } from "@/auth";
import { TEMP_USER_CONTENT } from "@/lib/constant";
import { NOUTIFY_DEBUG } from "@/env";

export async function createTempUser({ user }: { user: User }) {
  fs.writeFileSync(
    TEMP_USER_CONTENT,
    JSON.stringify({ user, expire: Date.now() + 1000 * 30 }) // 30 seconds
  );

  if (NOUTIFY_DEBUG) {
    console.log("TEMP_USER_CONTENT", TEMP_USER_CONTENT);
  }

  return { success: true };
}

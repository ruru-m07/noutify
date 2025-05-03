"use server";

import { promises as fs, existsSync } from "fs";

import { TEMP_USER_CONTENT } from "@/lib/constant";
import { NOUTIFY_DEBUG } from "@/env";

export async function poolTempUser() {
  if (!existsSync(TEMP_USER_CONTENT)) {
    return { success: false };
  }
  const fileContent = await fs.readFile(TEMP_USER_CONTENT, "utf-8");
  const parsedContent = JSON.parse(fileContent);

  console.log({
    export: parsedContent.expire,
    now: Date.now(),
    same: parsedContent.expire < Date.now(),
  });

  if (parsedContent.expire < Date.now()) {
    await fs.unlink(TEMP_USER_CONTENT);
    return { success: false };
  }

  if (NOUTIFY_DEBUG) {
    console.log("TEMP_USER_CONTENT", TEMP_USER_CONTENT);
    console.log("TEMP_USER_CONTENT_CONTENT", fileContent);
  }

  if (parsedContent) {
    return { success: true, user: parsedContent };
  } else {
    return { success: false };
  }
}

"use server";

import { promises as fs, existsSync } from "fs";

import { TEMP_USER_CONTENT } from "@/lib/constant";
import { log } from "@/lib/logger";

export async function poolTempUser() {
  if (!existsSync(TEMP_USER_CONTENT)) {
    return { success: false };
  }
  const fileContent = await fs.readFile(TEMP_USER_CONTENT, "utf-8");
  const parsedContent = JSON.parse(fileContent);

  if (parsedContent.expire < Date.now()) {
    await fs.unlink(TEMP_USER_CONTENT);
    return { success: false };
  }

  log.debug("TEMP_USER_CONTENT", TEMP_USER_CONTENT);
  log.debug("TEMP_USER_CONTENT_CONTENT", fileContent);

  if (parsedContent) {
    return { success: true, user: parsedContent };
  } else {
    return { success: false };
  }
}

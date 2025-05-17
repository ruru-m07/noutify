"use server";

import { promises as fs } from "fs";

import { TEMP_CODE_FILE } from "@/lib/constant";
import { log } from "@/lib/logger";

export async function storeTempCode() {
  const code = Math.random().toString(36).substring(2, 8);

  await fs.writeFile(TEMP_CODE_FILE, JSON.stringify({ code }));

  log.debug("TEMP_CODE_FILE", TEMP_CODE_FILE);
  log.debug("TEMP_CODE_FILE_CONTENT", code);

  return { code };
}

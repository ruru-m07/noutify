"use server";

import { promises as fs } from "fs";

import { TEMP_CODE_FILE } from "@/lib/constant";
import { log } from "@/lib/logger";

export async function getTempCode() {
  const code = await fs.readFile(TEMP_CODE_FILE, "utf-8");

  log.debug("TEMP_CODE_FILE", TEMP_CODE_FILE);
  log.debug("TEMP_CODE_FILE_CONTENT", code);

  return code;
}

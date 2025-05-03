"use server";

import { promises as fs } from "fs";

import { NOUTIFY_DEBUG } from "@/env";
import { TEMP_CODE_FILE } from "@/lib/constant";

export async function storeTempCode() {
  const code = Math.random().toString(36).substring(2, 8);

  await fs.writeFile(TEMP_CODE_FILE, JSON.stringify({ code }));

  if (NOUTIFY_DEBUG) {
    console.log("TEMP_CODE_FILE", TEMP_CODE_FILE);
    console.log("TEMP_CODE_FILE_CONTENT", code);
  }

  return { code };
}

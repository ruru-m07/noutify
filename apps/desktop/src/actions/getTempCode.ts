"use server";

import fs from "fs";

import { NOUTIFY_DEBUG } from "@/env";
import { TEMP_CODE_FILE } from "@/lib/constant";

export async function getTempCode() {
  const code = fs.readFileSync(TEMP_CODE_FILE, "utf-8");

  if (NOUTIFY_DEBUG) {
    console.log("TEMP_CODE_FILE", TEMP_CODE_FILE);
    console.log("TEMP_CODE_FILE_CONTENT", code);
  }

  return code;
}

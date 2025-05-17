"use server";

import { NOUTIFY_UP_STREAM } from "@/env";
import { log } from "@/lib/logger";

export async function getUpStreamURL() {
  log.info("Upstream URL: ", NOUTIFY_UP_STREAM);
  return NOUTIFY_UP_STREAM;
}

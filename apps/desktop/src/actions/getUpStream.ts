"use server";

import { NOUTIFY_UP_STREAM } from "@/env";

export async function getUpStreamURL() {
  return NOUTIFY_UP_STREAM;
}

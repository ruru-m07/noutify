"use server";

import { log } from "@/lib/logger";

export async function getServerPort() {
  log.info("Server port: ", process.env.PORT);
  return { port: process.env.PORT };
}

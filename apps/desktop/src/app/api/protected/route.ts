/* eslint-disable @typescript-eslint/no-explicit-any */
import { auth } from "@/auth";
import { log } from "@/lib/logger";

export const GET = auth((req: any) => {
  if (req.auth) {
    log.debug("Authenticated user:", req.auth);
    return Response.json({ data: "Protected data" });
  }

  log.debug("Not authenticated");
  return Response.json({ message: "Not authenticated" }, { status: 401 });
}) as any;

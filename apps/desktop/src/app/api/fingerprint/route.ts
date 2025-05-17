import { machineIdSync } from "node-machine-id";
import crypto from "crypto";
import { log } from "@/lib/logger";

export const GET = async () => {
  const fingerprint = machineIdSync();
  const deviceId = crypto
    .createHash("sha256")
    .update(fingerprint)
    .digest("hex");

  log.debug("Generated deviceId:", deviceId);
  return new Response(deviceId, {
    status: 200,
    headers: {
      "Content-Type": "text/plain",
      "Cache-Control": "no-store",
    },
  });
};

export const runtime = "nodejs";

import { getTempCode } from "@/actions/getTempCode";
import { NOUTIFY_DEBUG, NOUTIFY_UP_STREAM } from "@/env";
import { corsHeaders } from "@/lib/cors";
import { log } from "@/lib/logger";
import { NextResponse } from "next/server";

export async function OPTIONS(req: Request) {
  const origin = req.headers.get("origin") || NOUTIFY_UP_STREAM!;

  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders(origin),
  });
}

export async function POST(req: Request) {
  const origin = req.headers.get("origin") || NOUTIFY_UP_STREAM!;

  const { code } = await req.json();

  const tempCode = await getTempCode();

  log.debug("TEMP_CODE_FILE", tempCode);
  if (JSON.parse(tempCode).code !== code) {
    return NextResponse.json(
      {
        success: false,
        message: "Invalid code",
      },
      { status: 401, headers: corsHeaders(origin) }
    );
  }

  log.debug("Code validated successfully for user:", req.headers.get("user-id"));
  return NextResponse.json(
    {
      success: true,
    },
    { headers: corsHeaders(origin) }
  );
}

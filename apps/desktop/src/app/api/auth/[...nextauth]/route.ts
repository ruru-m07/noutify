import { handlers } from "@/auth";
import { NOUTIFY_UP_STREAM } from "@/env";
import { corsHeaders } from "@/lib/cors";
import { NextResponse } from "next/server";

export async function OPTIONS(req: Request) {
  const origin = req.headers.get("origin") || NOUTIFY_UP_STREAM!;

  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders(origin),
  });
}

export const { GET, POST } = handlers;

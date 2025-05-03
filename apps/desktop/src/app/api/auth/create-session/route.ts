import { createTempUser } from "@/actions/createTempUser";
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

export async function POST(req: Request) {
  const origin = req.headers.get("origin") || NOUTIFY_UP_STREAM!;

  const data = await req.json();

  const { user } = data;

  const { success } = await createTempUser({ user });

  if (!success) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to create temp user",
      },
      { headers: corsHeaders(origin) }
    );
  }

  return NextResponse.json(
    {
      success: true,
    },
    { headers: corsHeaders(origin) }
  );
}

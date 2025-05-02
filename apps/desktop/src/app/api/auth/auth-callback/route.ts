import { getTempCode } from "@/actions/getTempCode";
import { NOUTIFY_DEBUG, NOUTIFY_UP_STREAM } from "@/env";
import { NextResponse } from "next/server";

function corsHeaders(origin: string) {
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Credentials": "true",
  };
}

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

  if (JSON.parse(tempCode).code !== code) {
    return NextResponse.json(
      {
        success: false,
        message: "Invalid code",
      },
      { status: 401, headers: corsHeaders(origin) }
    );
  }

  if (NOUTIFY_DEBUG) {
    console.log("Code validated successfully");
  }

  return NextResponse.json(
    {
      success: true,
    },
    { headers: corsHeaders(origin) }
  );
}

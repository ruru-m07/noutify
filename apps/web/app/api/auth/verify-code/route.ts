import prisma from "@/lib/prisma";
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
  const origin = req.headers.get("origin") || "http://localhost:3000";

  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders(origin),
  });
}

export async function POST(req: Request) {
  const origin = req.headers.get("origin") || "http://localhost:3000";

  try {
    const { code, deviceId } = await req.json();


    const data = await prisma.tokenMap.findFirst({
      where: {
        code: code,
        deviceId: deviceId,
        expiresAt: {
          gte: new Date(),
        },
      },
    });

    if (!data) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid code, device ID or might be expired",
        },
        { headers: corsHeaders(origin) }
      );
    }
    
    return NextResponse.json(
      {
        success: true,
        data,
      },
      { headers: corsHeaders(origin) }
    );
  } catch (error) {
    console.error("Error verifying code:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Server error occurred",
      },
      {
        status: 500,
        headers: corsHeaders(origin),
      }
    );
  }
}

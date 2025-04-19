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

  const data = await req.json();

  await prisma.tokenMap.deleteMany({
    where: {
      deviceId: data.deviceId,
    },
  });

  try {
    return NextResponse.json(
      {
        success: true,
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

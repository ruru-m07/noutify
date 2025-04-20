"use server";

import { auth } from "@/auth";
import prisma from "@/lib/prisma";

export async function authorizeDeviceAction(deviceId: string) {
  const session = await auth();

  if (!session) {
    return {
      success: false,
      error: "You must be logged in to authorize a device.",
    };
  }

  if (!deviceId) {
    return { success: false, error: "Device ID is missing." };
  }

  const code = Math.random().toString(36).substring(2, 8).toUpperCase();

  await prisma.tokenMap.deleteMany({
    where: {
      deviceId: deviceId,
    },
  });

  const createdDeviceToken = await prisma.tokenMap.create({
    data: {
      deviceId: deviceId,
      session: JSON.stringify(session),
      expiresAt: new Date(Date.now() + 1000 * 60 * 2), // ? 2 minutes
      code: code,
    },
  });

  if (!createdDeviceToken) {
    return { success: false, error: "Device token creation failed." };
  }

  return { success: true, code };
}

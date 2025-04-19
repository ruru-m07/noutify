"use server";

export async function createSession({
  code,
  deviceId,
}: {
  code: string;
  deviceId: string;
}) {
  const { signIn } = await import("@/auth");

  await signIn("credentials", {
    code: code,
    deviceId: deviceId,
    redirectTo: "/",
  });

  return {
    success: true,
  };
}

"use server";

import { log } from "@/lib/logger";

/* eslint-disable @typescript-eslint/no-explicit-any */
export async function createSession({ user }: { user: any }) {
  const { signIn } = await import("@/auth");

  await signIn("credentials", {
    name: user.name,
    email: user.email,
    image: user.image,
    plogin: user.profile.login,
    pid: user.profile.id,
    pavatar_url: user.profile.avatar_url,
    purl: user.profile.url,
    ptype: user.profile.type,
    pname: user.profile.name,
    pemail: user.profile.email,
    redirectTo: "/",
  });

  log.info("Session created successfully for user: ", user.name);
  return {
    success: true,
  };
}

"use server";

import { auth } from "@/auth";

export async function sendSession({ port }: { port: string }) {
  const session = await auth();

  const user = {
    name: session.user.name,
    email: session.user.email,
    image: session.user.profile.avatar_url,
    profile: {
      login: session.user.profile.login,
      id: session.user.profile.id,
      avatar_url: session.user.profile.avatar_url,
      url: session.user.profile.url,
      type: session.user.profile.type,
      name: session.user.profile.name,
      email: session.user.profile.email,
    },
  };

  console.log({
    user,
  });

  const res = await fetch(`http://localhost:${port}/api/auth/create-session`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      user: user,
    }),
  });

  console.log({
    hmmmmmmmmmmmm: "asds",
    "create-session": res,
  });

  return {
    data: {
      success: true,
    },
  };
}

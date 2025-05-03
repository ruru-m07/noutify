"use server";

import { GithubClient } from "@noutify/functions";
import type { RestEndpointMethodTypes } from "@octokit/plugin-rest-endpoint-methods";

import { redirect } from "next/navigation";

export async function setTokenAction({ token }: { token: string }) {
  const { update, auth } = await import("@/auth");

  const session = await auth();

  const ghClient = new GithubClient({
    token,
  });

  let user:
    | RestEndpointMethodTypes["users"]["getAuthenticated"]["response"]["data"]
    | null = null;

  try {
    user = await ghClient.users.getAuthenticatedUser();
  } catch (error) {
    console.error(error);
  }

  // ! Check if user is authenticated
  if (!user) {
    return {
      error: "Hmmm, seems like the token is invalid. Please try again",
    };
  }

  // ! Check session user is the same as the authenticated user
  if (session && session.user?.profile.login !== user.login) {
    return {
      warning: `Please Enter the correct token of the logged in user. Got ${session.user?.profile.login} but expected ${user.login}`,
    };
  }

  await update({
    user: {
      accessToken: token,
    },
  });

  redirect("/");
}

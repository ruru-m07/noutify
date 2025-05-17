"use server";

import { log } from "@/lib/logger";
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
    log.error(
      `[setTokenAction]: Failed to authenticate user with token ${token}`,
      error
    );
    return {
      error: "Failed to authenticate user with token",
    };
  }

  // ! Check if user is authenticated
  if (!user) {
    log.error(
      `[setTokenAction]: Failed to authenticate user with token ${token}`
    );
    return {
      error: "Hmmm, seems like the token is invalid. Please try again",
    };
  }

  // ! Check session user is the same as the authenticated user
  if (session && session.user?.profile.login !== user.login) {
    log.warn(
      `User ${session.user?.profile.login} is trying to set token for ${user.login}`
    );
    return {
      warning: `Please Enter the correct token of the logged in user. Got ${session.user?.profile.login} but expected ${user.login}`,
    };
  }

  log.info(
    `[setTokenAction]: User ${user.login} authenticated with token ${token}`
  );
  await update({
    user: {
      accessToken: token,
    },
  });

  log.info(
    `[setTokenAction]: User ${user.login} authenticated with token ${token}`
  );
  redirect("/");
}

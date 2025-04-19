import { auth } from "@/auth";
import { GithubClient } from "@noutify/functions";

export async function getGithubClient(): Promise<GithubClient> {
  const session = await auth();
  if (!session || !session.user.accessToken) {
    throw new Error("No valid session available");
  }
  return new GithubClient({
    token: session.user.accessToken,
  });
}

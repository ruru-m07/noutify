import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import { env } from "@noutify/env";
import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { Pool } from "@neondatabase/serverless";
import { PrismaAdapter } from "@auth/prisma-adapter";

const neon = new Pool({
  connectionString: process.env.DATABASE_URL,
});
const adapter = new PrismaNeon(neon);
const prisma = new PrismaClient({ adapter });

export const {
  handlers,
  auth,
  signIn,
  signOut,
  unstable_update: update,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
}: any = NextAuth({
  // @ts-expect-error - PrismaAdapter is not in the types
  adapter: PrismaAdapter(prisma),
  providers: [
    GitHub({
      clientId: env.OAUTH_GITHUB_ID,
      clientSecret: env.OAUTH_GITHUB_SECRET,
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    jwt({ token, trigger, session, user, profile }) {
      if (trigger === "update" && session) {
        token.accessToken = session.user.accessToken;
      }
      if (user) {
        token.profile = profile;
      }
      return token;
    },
    async session({ session, token }) {
      const profile = token.profile as Profile;

      if (session && profile) {
        if (!session.user.profile) {
          session.user.profile = {} as Profile;
        }

        if (token.accessToken) {
          session.user.accessToken = token.accessToken as string;
        }

        session.user.profile.login = profile.login;
        session.user.profile.id = profile.id;
        session.user.profile.avatar_url = profile.avatar_url;
        session.user.profile.url = profile.url;
        session.user.profile.type = profile.type;
        session.user.profile.name = profile.name;
        session.user.profile.email = profile.email;
      }

      return session;
    },
    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },
  pages: {
    signIn: "/auth/login",
  },
  trustHost: true,
});

export interface Profile {
  login: string;
  id: string | number;
  avatar_url: string;
  url: string;
  type: string;
  name: string;
  email: string;
}

declare module "next-auth" {
  interface Session {
    user: {
      name: string;
      email: string;
      image: string;
      accessToken?: string;
      profile: Profile;
    };
  }
  interface User {
    accessToken?: string;
    profile: Profile;
  }
}

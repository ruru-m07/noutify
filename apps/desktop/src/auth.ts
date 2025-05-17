import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { getUpStreamURL } from "./actions/getUpStream";

export type User = {
  name: string;
  email: string;
  image: string;
  profile: {
    login: string;
    id: number;
    avatar_url: string;
    url: string;
    type: string;
    name: string;
    email: string;
  };
};

export const {
  handlers,
  auth,
  signIn,
  signOut,
  unstable_update: update,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
}: any = NextAuth({
  providers: [
    Credentials({
      credentials: {
        name: {},
        email: {},
        image: {},
        plogin: {},
        pid: {},
        pavatar_url: {},
        purl: {},
        ptype: {},
        pname: {},
        pemail: {},
      },
      authorize: async (credentials) => {
        const newSession = {
          name: credentials.name as string,
          email: credentials.email as string,
          image: credentials.image as string,
          profile: {
            login: credentials.plogin as string,
            id: credentials.pid as string,
            avatar_url: credentials.pavatar_url as string,
            url: credentials.purl as string,
            type: credentials.ptype as string,
            name: credentials.pname as string,
            email: credentials.pemail as string,
          },
        };

        return newSession;
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (trigger === "update" && session) {
        token.accessToken = session.user.accessToken;
      }
      if (user) {
        token.profile = user.profile;
        token.accessToken = user.accessToken;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.profile = token.profile as Profile;
      session.user.accessToken = token.accessToken as string;

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

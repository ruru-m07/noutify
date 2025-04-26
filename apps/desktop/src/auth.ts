import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { getUpStreamURL } from "./actions/getUpStream";

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
        code: {},
        deviceId: {},
      },
      authorize: async (credentials) => {
        const streamURL = await getUpStreamURL();
        const response = await fetch(`${streamURL}/api/auth/verify-code`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            deviceId: credentials.deviceId,
            code: credentials.code,
          }),
        });

        const jsonResponse: {
          success: boolean;
          error?: string;
          data?: {
            session: string;
          };
        } = await response.json();

        if (jsonResponse.error) {
          return null;
        }
        if (!jsonResponse.success) {
          return null;
        }

        const parsedData: {
          user: {
            name: string;
            email: string;
            image: string;
            profile: Profile;
            accessToken: string;
          };
        } = JSON.parse(jsonResponse?.data?.session || "{}");
        const newSession = {
          name: parsedData.user.name,
          email: parsedData.user.email,
          image: parsedData.user.image,
          profile: {
            login: parsedData.user.profile.login,
            id: parsedData.user.profile.id,
            avatar_url: parsedData.user.profile.avatar_url,
            url: parsedData.user.profile.url,
            type: parsedData.user.profile.type,
            name: parsedData.user.profile.name,
            email: parsedData.user.profile.email,
          },
          accessToken: parsedData.user.accessToken,
        };

        return newSession;
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
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

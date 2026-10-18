/**

* © 2026 CodeX Devs — All Rights Reserved
  */


import DiscordProvider from "next-auth/providers/discord";
import type { AuthOptions } from "next-auth";

export const authOptions: AuthOptions = {
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID!,
      clientSecret: process.env.DISCORD_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: "identify guilds",
        },
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user && token.sub) {
        (session.user as typeof session.user & { id: string }).id =
          token.sub;
      }

      (session as typeof session & { accessToken?: string }).accessToken =
        token.accessToken as string | undefined;

      return session;
    },
  },

  pages: {
    signIn: "/",
  },
};

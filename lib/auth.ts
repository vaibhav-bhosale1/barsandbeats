import GoogleProvider from "next-auth/providers/google";
import { prismaClient } from "@/lib/db";
import type { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET ?? "secret",
  
  // ✨ Add the pages option here
  pages: {
    signIn: '/auth/signin', // Tells NextAuth.js to use this path for the sign-in page
  },

  callbacks: {
    async signIn(params) {
      if (!params.user.email) {
        return false;
      }
      try {
        await prismaClient.user.upsert({
          where: {
            email: params.user.email,
          },
          create: {
            email: params.user.email,
            provider: "Google",
          },
          update: {},
        });
      } catch (e) {
        console.error("Database error:", e);
        return false;
      }
      return true;
    },
  },
};
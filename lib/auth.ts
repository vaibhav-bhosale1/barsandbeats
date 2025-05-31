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
  callbacks:{
    async signIn(params){
      if(!params.user.email){
        return false;
      }
      try{
        await prismaClient.user.create({
            data:{
              email:params?.user?.email,
              provider:"Google"

            }
        })
      } catch (e) {
        // Ignore duplicate users or handle error
      }

      return true;
    },
  },
};

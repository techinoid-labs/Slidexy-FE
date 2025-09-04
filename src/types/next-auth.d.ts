// src/types/next-auth.d.ts
import NextAuth, { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      accessToken: string;
      presentationId?: string;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    id: string;
    accessToken: string;
    presentationId?: string;
  }

  interface JWT {
    id: string;
    accessToken: string;
    presentationId?: string;
  }
}

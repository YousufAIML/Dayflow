import NextAuth from "next-auth";
import { DefaultSession, DefaultUser } from "next-auth";
import { JWT, DefaultJWT } from "next-auth/jwt";

/**
 * NextAuth type augmentation.
 * Adds `role` and `id` to Session.user and `role` + `userId` to JWT.
 */
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
      employeeId: string;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    role: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    userId: string;
    role: string;
    employeeId: string;
  }
}

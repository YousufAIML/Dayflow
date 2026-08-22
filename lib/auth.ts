import NextAuth, { NextAuthOptions, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { prisma } from "@/lib/prisma";

/**
 * NextAuth configuration.
 * - Uses CredentialsProvider with email + password
 * - jwt callback injects role + userId into the token
 * - session callback surfaces role + id on session.user
 */
export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },

  pages: {
    signIn: "/signin",
    error: "/signin",
  },

  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Email & Password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required.");
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email.toLowerCase().trim() },
        });

        if (!user) {
          throw new Error("No account found with this email.");
        }

        const passwordMatch = await compare(credentials.password, user.password);
        if (!passwordMatch) {
          throw new Error("Incorrect password.");
        }

        // Return the subset of user data for the token
        return {
          id: user.id,
          email: user.email,
          name: user.fullName ?? user.email,
          role: user.role,
          employeeId: user.employeeId,
        } as User & { role: string; employeeId: string };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      // On first sign-in, `user` is populated — persist to token
      if (user) {
        token.userId = user.id;
        token.role = (user as User & { role: string }).role;
        token.employeeId = (user as User & { role: string; employeeId: string }).employeeId;
      }
      return token;
    },

    async session({ session, token }) {
      // Expose userId + role on session.user for client and server use
      if (session.user) {
        session.user.id = token.userId as string;
        session.user.role = token.role as string;
        session.user.employeeId = token.employeeId as string;
      }
      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);

import { getServerSession } from "next-auth";

export type SessionUser = { id: string; role: "ADMIN" | "EMPLOYEE"; name: string; employeeId: string };

export async function getSession(_req?: Request): Promise<SessionUser | null> {
  const session = await getServerSession(authOptions);
  
  if (!session?.user) return null;
  
  return {
    id: session.user.id,
    role: session.user.role as "ADMIN" | "EMPLOYEE",
    name: session.user.name ?? "Unknown",
    employeeId: session.user.employeeId,
  };
}

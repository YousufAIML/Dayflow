import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

/**
 * NextAuth v4 App Router catch-all handler.
 * Handles all /api/auth/* routes (signin, signout, session, csrf, etc.)
 */
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

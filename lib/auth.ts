/**
 * Auth shim — drop-in replacement until the auth branch merges.
 *
 * Usage in API routes:
 *   const session = await getSession(request)
 *   if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 })
 *
 * When auth merges, replace the body of getSession() with:
 *   return getServerSession(authOptions) as Promise<SessionUser | null>
 *
 * Demo: set the cookie in your browser:
 *   document.cookie = 'dayflow_user=<userId>; path=/'
 */

import { cookies } from "next/headers";
import { prisma } from "./prisma";

export type SessionUser = {
  id: string;
  role: "ADMIN" | "EMPLOYEE";
  name: string;
  employeeId: string;
};

export async function getSession(
  _req?: Request
): Promise<SessionUser | null> {
  try {
    const cookieStore = await cookies();
    const userIdCookie = cookieStore.get("dayflow_user");

    let userId: string | null = userIdCookie?.value ?? null;

    // In dev with no cookie, fall back to the first user in DB for demo
    if (!userId && process.env.NODE_ENV !== "production") {
      const fallback = await prisma.user.findFirst({
        orderBy: { createdAt: "asc" },
      });
      userId = fallback?.id ?? null;
    }

    if (!userId) return null;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, role: true, fullName: true, employeeId: true },
    });

    if (!user) return null;

    return {
      id: user.id,
      role: user.role,
      name: user.fullName ?? "Unknown",
      employeeId: user.employeeId,
    };
  } catch {
    return null;
  }
}

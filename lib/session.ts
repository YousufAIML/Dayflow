import { prisma } from "./prisma";
import { ensureSeedData } from "./seed-data";
import { headers, cookies } from "next/headers";

export interface AuthenticatedUser {
  id: string;
  employeeId: string;
  email: string;
  role: "ADMIN" | "EMPLOYEE";
  fullName: string | null;
  jobTitle: string | null;
  department: string | null;
}

export async function getCurrentUser(rolePreference?: "ADMIN" | "EMPLOYEE"): Promise<AuthenticatedUser | null> {
  await ensureSeedData();

  try {
    const reqHeaders = await headers();
    const reqCookies = await cookies();

    const headerUserId = reqHeaders.get("x-user-id");
    const cookieUserId = reqCookies.get("dayflow_user_id")?.value;
    const targetUserId = headerUserId || cookieUserId;

    if (targetUserId) {
      const user = await prisma.user.findUnique({
        where: { id: targetUserId },
        select: {
          id: true,
          employeeId: true,
          email: true,
          role: true,
          fullName: true,
          jobTitle: true,
          department: true,
        },
      });
      if (user) return user;
    }

    // Default lookup by role preference or first employee
    const targetRole = rolePreference || "EMPLOYEE";
    const defaultUser = await prisma.user.findFirst({
      where: { role: targetRole },
      select: {
        id: true,
        employeeId: true,
        email: true,
        role: true,
        fullName: true,
        jobTitle: true,
        department: true,
      },
      orderBy: { createdAt: "asc" },
    });

    if (defaultUser) return defaultUser;

    return await prisma.user.findFirst({
      select: {
        id: true,
        employeeId: true,
        email: true,
        role: true,
        fullName: true,
        jobTitle: true,
        department: true,
      },
    });
  } catch (error) {
    console.error("Error retrieving user session:", error);
    return null;
  }
}

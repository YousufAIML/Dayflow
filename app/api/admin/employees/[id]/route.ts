import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const adminUpdateSchema = z.object({
  fullName: z.string().min(2).max(100).optional(),
  phone: z.string().max(20).optional().nullable(),
  address: z.string().max(500).optional().nullable(),
  profilePic: z.string().max(2000000).optional().nullable(),
  jobTitle: z.string().max(100).optional().nullable(),
  department: z.string().max(100).optional().nullable(),
  role: z.enum(["EMPLOYEE", "ADMIN"]).optional(),
});

/* GET /api/admin/employees/[id] */
export async function GET(
  _req: NextRequest,
  ctx: RouteContext<"/api/admin/employees/[id]">
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await ctx.params;

  const user = await prisma.user.findUnique({
    where: { id },
    include: { payroll: true },
  });
  if (!user) return NextResponse.json({ error: "Employee not found" }, { status: 404 });

  const { password: _pw, ...safeUser } = user;
  return NextResponse.json(safeUser);
}

/* PATCH /api/admin/employees/[id] */
export async function PATCH(
  request: NextRequest,
  ctx: RouteContext<"/api/admin/employees/[id]">
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await ctx.params;

  try {
    const body = await request.json();
    const parsed = adminUpdateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", issues: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const updated = await prisma.user.update({
      where: { id },
      data: parsed.data,
      select: {
        id: true,
        employeeId: true,
        fullName: true,
        email: true,
        phone: true,
        address: true,
        profilePic: true,
        jobTitle: true,
        department: true,
        role: true,
        dateJoined: true,
        updatedAt: true,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("[PATCH /api/admin/employees/[id]]", error);
    return NextResponse.json({ error: "Failed to update employee." }, { status: 500 });
  }
}

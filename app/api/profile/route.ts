import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const employeeUpdateSchema = z.object({
  phone: z.string().max(20).optional().nullable(),
  address: z.string().max(500).optional().nullable(),
  profilePic: z.string().max(2000000).optional().nullable(), // base64 or URL
});

const adminUpdateSchema = z.object({
  fullName: z.string().min(2).max(100).optional(),
  phone: z.string().max(20).optional().nullable(),
  address: z.string().max(500).optional().nullable(),
  profilePic: z.string().max(2000000).optional().nullable(),
  jobTitle: z.string().max(100).optional().nullable(),
  department: z.string().max(100).optional().nullable(),
});

/* GET /api/profile — own profile */
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { payroll: true },
  });

  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const { password: _pw, ...safeUser } = user;
  return NextResponse.json(safeUser);
}

/* PATCH /api/profile — update own profile */
export async function PATCH(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const schema =
      session.user.role === "ADMIN" ? adminUpdateSchema : employeeUpdateSchema;
    const parsed = schema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", issues: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const updated = await prisma.user.update({
      where: { id: session.user.id },
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
    console.error("[PATCH /api/profile]", error);
    return NextResponse.json({ error: "Failed to update profile." }, { status: 500 });
  }
}

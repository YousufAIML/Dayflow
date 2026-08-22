import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { hash } from "bcryptjs";
import { prisma } from "@/lib/prisma";

const signupSchema = z.object({
  employeeId: z
    .string()
    .min(3, "Employee ID must be at least 3 characters")
    .max(20, "Employee ID must be at most 20 characters")
    .regex(/^[A-Za-z0-9_-]+$/, "Employee ID can only contain letters, numbers, hyphens, and underscores"),
  fullName: z.string().min(2, "Full name must be at least 2 characters").max(100),
  email: z.email("Please enter a valid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
  role: z.enum(["EMPLOYEE", "ADMIN"]).default("EMPLOYEE"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = signupSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", issues: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { employeeId, fullName, email, password, role } = parsed.data;
    const normalizedEmail = email.toLowerCase().trim();

    // Check for existing user
    const existing = await prisma.user.findFirst({
      where: { OR: [{ email: normalizedEmail }, { employeeId }] },
      select: { email: true, employeeId: true },
    });

    if (existing) {
      if (existing.email === normalizedEmail) {
        return NextResponse.json(
          { error: "An account with this email already exists." },
          { status: 409 }
        );
      }
      return NextResponse.json(
        { error: "An account with this Employee ID already exists." },
        { status: 409 }
      );
    }

    // Hash password with bcrypt (salt rounds: 12)
    const hashedPassword = await hash(password, 12);

    // Simulate email verification token (structured for real flow)
    const verificationToken = crypto.randomUUID();
    console.log(
      `[Dayflow] Email verification token for ${normalizedEmail}: ${verificationToken}`
    );
    console.log(
      `[Dayflow] Verification URL: ${process.env.NEXTAUTH_URL}/verify-email?token=${verificationToken}`
    );

    // Create user
    const user = await prisma.user.create({
      data: {
        employeeId,
        fullName,
        email: normalizedEmail,
        password: hashedPassword,
        role,
        emailVerified: false, // requires email verification (simulated)
      },
      select: {
        id: true,
        employeeId: true,
        email: true,
        fullName: true,
        role: true,
        createdAt: true,
      },
    });

    return NextResponse.json(
      { message: "Account created successfully.", user },
      { status: 201 }
    );
  } catch (error) {
    console.error("[signup] Unexpected error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again." },
      { status: 500 }
    );
  }
}

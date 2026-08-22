import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const user = await getSession();
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized. User session not found." },
        { status: 401 }
      );
    }

    const userPayslips = await prisma.payslip.findMany({
      where: {
        userId: user.id,
      },
      orderBy: [
        { year: "desc" },
        { month: "desc" }
      ],
    });

    return NextResponse.json({
      success: true,
      data: {
        payslips: userPayslips,
      },
    });
  } catch (error: unknown) {
    console.error("Error fetching payroll data:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to fetch payroll data.",
      },
      { status: 500 }
    );
  }
}

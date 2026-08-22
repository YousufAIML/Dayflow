import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser("ADMIN");
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized. Admin session required." },
        { status: 401 }
      );
    }

    const leaves = await prisma.leaveRequest.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            employeeId: true,
            department: true,
            jobTitle: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: { leaves },
    });
  } catch (error: unknown) {
    console.error("Error fetching all leaves:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to fetch leaves.",
      },
      { status: 500 }
    );
  }
}

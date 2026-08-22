import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { createLeaveSchema } from "@/lib/validations/leave";

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser("EMPLOYEE");
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized. User session not found." },
        { status: 401 }
      );
    }

    const body = await req.json();
    const parseResult = createLeaveSchema.safeParse(body);

    if (!parseResult.success) {
      const fieldErrors: Record<string, string> = {};
      parseResult.error.issues.forEach((err) => {
        const path = err.path.join(".");
        if (path) fieldErrors[path] = err.message;
      });
      return NextResponse.json(
        {
          success: false,
          error: parseResult.error.issues[0]?.message || "Invalid input data",
          fieldErrors,
        },
        { status: 400 }
      );
    }

    const data = parseResult.data;
    const startDateTime = new Date(`${data.startDate}T00:00:00.000Z`);
    const endDateTime = new Date(`${data.endDate}T23:59:59.999Z`);

    // Check for overlapping pending or approved leave requests
    const overlapping = await prisma.leaveRequest.findFirst({
      where: {
        userId: user.id,
        status: { in: ["PENDING", "APPROVED"] },
        startDate: { lte: endDateTime },
        endDate: { gte: startDateTime },
      },
    });

    if (overlapping) {
      const existingStart = overlapping.startDate.toISOString().split("T")[0];
      const existingEnd = overlapping.endDate.toISOString().split("T")[0];
      return NextResponse.json(
        {
          success: false,
          error: `Overlap detected: You already have a ${overlapping.status.toLowerCase()} ${overlapping.type.toLowerCase()} leave request from ${existingStart} to ${existingEnd}.`,
        },
        { status: 409 }
      );
    }

    // Insert leave request into database
    const newLeave = await prisma.leaveRequest.create({
      data: {
        userId: user.id,
        type: data.type,
        startDate: startDateTime,
        endDate: endDateTime,
        remarks: data.remarks && data.remarks.trim().length > 0 ? data.remarks.trim() : null,
        status: "PENDING",
      },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            employeeId: true,
            department: true,
          },
        },
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Leave application submitted successfully.",
        data: newLeave,
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error("Error creating leave request:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to process leave request.",
      },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser("EMPLOYEE");
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized." },
        { status: 401 }
      );
    }

    // Compute annual totals for this employee
    const currentYear = new Date().getFullYear();
    const yearStart = new Date(currentYear, 0, 1);
    const yearEnd = new Date(currentYear, 11, 31, 23, 59, 59);

    const userLeaves = await prisma.leaveRequest.findMany({
      where: {
        userId: user.id,
        startDate: { gte: yearStart, lte: yearEnd },
      },
      orderBy: { createdAt: "desc" },
    });

    // Calculate taken days
    let paidDaysUsed = 0;
    let sickDaysUsed = 0;
    let unpaidDaysUsed = 0;
    let pendingCount = 0;

    userLeaves.forEach((leave) => {
      if (leave.status === "PENDING") {
        pendingCount++;
      }
      if (leave.status === "APPROVED") {
        const diffTime = Math.abs(leave.endDate.getTime() - leave.startDate.getTime());
        const days = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
        if (leave.type === "PAID") paidDaysUsed += days;
        if (leave.type === "SICK") sickDaysUsed += days;
        if (leave.type === "UNPAID") unpaidDaysUsed += days;
      }
    });

    const balances = {
      paid: { total: 18, used: paidDaysUsed, remaining: Math.max(0, 18 - paidDaysUsed) },
      sick: { total: 10, used: sickDaysUsed, remaining: Math.max(0, 10 - sickDaysUsed) },
      unpaid: { used: unpaidDaysUsed },
      pendingCount,
    };

    return NextResponse.json({
      success: true,
      data: {
        user,
        balances,
        recentLeaves: userLeaves.slice(0, 5),
      },
    });
  } catch (error: unknown) {
    console.error("Error fetching leave summary:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to fetch leave summary.",
      },
      { status: 500 }
    );
  }
}

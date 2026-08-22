import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { z } from "zod";

const updateStatusSchema = z.object({
  status: z.enum(["APPROVED", "REJECTED"]),
  comment: z.string().optional(),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser("ADMIN");
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized. Admin session required." },
        { status: 401 }
      );
    }

    const { id: leaveId } = await params;
    if (!leaveId) {
      return NextResponse.json(
        { success: false, error: "Leave ID is required." },
        { status: 400 }
      );
    }

    const body = await req.json();
    const parseResult = updateStatusSchema.safeParse(body);
    
    if (!parseResult.success) {
      return NextResponse.json(
        { success: false, error: "Invalid status provided." },
        { status: 400 }
      );
    }

    const { status, comment } = parseResult.data;

    const existingLeave = await prisma.leaveRequest.findUnique({
      where: { id: leaveId },
    });

    if (!existingLeave) {
      return NextResponse.json(
        { success: false, error: "Leave request not found." },
        { status: 404 }
      );
    }

    if (existingLeave.status !== "PENDING") {
      return NextResponse.json(
        { success: false, error: "Only PENDING requests can be updated." },
        { status: 400 }
      );
    }

    const updatedLeave = await prisma.leaveRequest.update({
      where: { id: leaveId },
      data: {
        status,
        remarks: comment && comment.trim().length > 0 
          ? (existingLeave.remarks ? `${existingLeave.remarks}\n\nAdmin: ${comment}` : `Admin: ${comment}`) 
          : existingLeave.remarks,
      },
    });

    return NextResponse.json({
      success: true,
      message: `Leave request successfully ${status.toLowerCase()}.`,
      data: updatedLeave,
    });
  } catch (error: unknown) {
    console.error("Error updating leave request:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to update leave request.",
      },
      { status: 500 }
    );
  }
}

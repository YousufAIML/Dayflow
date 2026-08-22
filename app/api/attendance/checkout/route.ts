import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(_request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();
  const todayStart = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
  );
  const todayEnd = new Date(todayStart.getTime() + 24 * 60 * 60 * 1000 - 1);

  const existing = await prisma.attendance.findFirst({
    where: {
      userId: session.id,
      date: { gte: todayStart, lte: todayEnd },
    },
  });

  if (!existing) {
    return Response.json(
      { error: "No check-in found for today. Please check in first." },
      { status: 400 }
    );
  }

  if (!existing.checkIn) {
    return Response.json(
      { error: "No active check-in to close." },
      { status: 400 }
    );
  }

  if (existing.checkOut) {
    return Response.json(
      {
        error: "Already checked out today",
        checkOut: existing.checkOut,
      },
      { status: 400 }
    );
  }

  const checkOutTime = new Date();
  const durationMs = checkOutTime.getTime() - existing.checkIn.getTime();
  const durationHours = durationMs / (1000 * 60 * 60);

  // Determine status based on hours worked
  const status = durationHours >= 4 && durationHours < 7 ? "HALF_DAY" : "PRESENT";

  const record = await prisma.attendance.update({
    where: { id: existing.id },
    data: {
      checkOut: checkOutTime,
      status,
    },
  });

  return Response.json({
    success: true,
    id: record.id,
    checkIn: record.checkIn,
    checkOut: record.checkOut,
    status: record.status,
    durationMinutes: Math.round(durationMs / 60000),
  });
}

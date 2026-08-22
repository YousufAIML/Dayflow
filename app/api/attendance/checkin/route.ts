import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

const BodySchema = z.object({}).strict();

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Validate body (empty for now, just ensuring content-type ok)
  try {
    const raw = await request.text();
    if (raw.trim()) {
      BodySchema.parse(JSON.parse(raw));
    }
  } catch {
    return Response.json({ error: "Invalid request body" }, { status: 400 });
  }

  // Today's date window (UTC midnight → end of day)
  const now = new Date();
  const todayStart = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
  );
  const todayEnd = new Date(todayStart.getTime() + 24 * 60 * 60 * 1000 - 1);

  // Check for existing record today
  const existing = await prisma.attendance.findFirst({
    where: {
      userId: session.id,
      date: { gte: todayStart, lte: todayEnd },
    },
  });

  if (existing?.checkIn) {
    return Response.json(
      {
        error: "Already checked in today",
        checkIn: existing.checkIn,
        id: existing.id,
      },
      { status: 400 }
    );
  }

  const checkInTime = new Date();

  const record = existing
    ? await prisma.attendance.update({
        where: { id: existing.id },
        data: { checkIn: checkInTime, status: "PRESENT" },
      })
    : await prisma.attendance.create({
        data: {
          userId: session.id,
          date: todayStart,
          checkIn: checkInTime,
          status: "PRESENT",
        },
      });

  return Response.json({
    success: true,
    id: record.id,
    checkIn: record.checkIn,
    status: record.status,
  });
}

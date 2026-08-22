import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

const QuerySchema = z.object({
  range: z.enum(["daily", "weekly", "monthly"]).default("daily"),
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "date must be YYYY-MM-DD")
    .optional(),
});

export async function GET(
  _request: NextRequest,
  ctx: RouteContext<"/api/attendance/[employeeId]">
) {
  const session = await getSession();
  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { employeeId } = await ctx.params;

  // Employees can only fetch their own data
  if (session.role === "EMPLOYEE" && session.employeeId !== employeeId) {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  // Resolve the user by employeeId
  const targetUser = await prisma.user.findUnique({
    where: { employeeId },
    select: { id: true, fullName: true, employeeId: true, jobTitle: true, department: true },
  });

  if (!targetUser) {
    return Response.json({ error: "Employee not found" }, { status: 404 });
  }

  const url = new URL(_request.url);
  const queryParsed = QuerySchema.safeParse({
    range: url.searchParams.get("range") ?? "daily",
    date: url.searchParams.get("date") ?? undefined,
  });

  if (!queryParsed.success) {
    return Response.json(
      { error: "Invalid query", details: queryParsed.error.flatten() },
      { status: 400 }
    );
  }

  const { range, date } = queryParsed.data;
  const baseDate = date ? new Date(date + "T00:00:00Z") : new Date();
  const utcBase = new Date(
    Date.UTC(baseDate.getUTCFullYear(), baseDate.getUTCMonth(), baseDate.getUTCDate())
  );

  let from: Date;
  let to: Date;

  if (range === "daily") {
    from = utcBase;
    to = new Date(utcBase.getTime() + 24 * 60 * 60 * 1000 - 1);
  } else if (range === "weekly") {
    // Monday of the week
    const day = utcBase.getUTCDay(); // 0=Sun
    const mondayOffset = day === 0 ? -6 : 1 - day;
    from = new Date(utcBase.getTime() + mondayOffset * 24 * 60 * 60 * 1000);
    to = new Date(from.getTime() + 7 * 24 * 60 * 60 * 1000 - 1);
  } else {
    // monthly
    from = new Date(Date.UTC(utcBase.getUTCFullYear(), utcBase.getUTCMonth(), 1));
    to = new Date(Date.UTC(utcBase.getUTCFullYear(), utcBase.getUTCMonth() + 1, 1) - 1);
  }

  const records = await prisma.attendance.findMany({
    where: {
      userId: targetUser.id,
      date: { gte: from, lte: to },
    },
    orderBy: { date: "asc" },
  });

  return Response.json({
    employee: targetUser,
    range,
    from: from.toISOString(),
    to: to.toISOString(),
    records: records.map((r) => ({
      id: r.id,
      date: r.date,
      checkIn: r.checkIn,
      checkOut: r.checkOut,
      status: r.status,
      durationMinutes:
        r.checkIn && r.checkOut
          ? Math.round((r.checkOut.getTime() - r.checkIn.getTime()) / 60000)
          : null,
    })),
  });
}

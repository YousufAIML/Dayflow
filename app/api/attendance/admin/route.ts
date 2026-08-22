import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

const QuerySchema = z.object({
  from: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  to: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  status: z.enum(["PRESENT", "ABSENT", "HALF_DAY", "LEAVE", "ALL"]).default("ALL"),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
});

export async function GET(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (session.role !== "ADMIN") {
    return Response.json({ error: "Forbidden — admin only" }, { status: 403 });
  }

  const url = new URL(request.url);
  const queryParsed = QuerySchema.safeParse({
    from: url.searchParams.get("from") ?? undefined,
    to: url.searchParams.get("to") ?? undefined,
    status: url.searchParams.get("status") ?? "ALL",
    page: url.searchParams.get("page") ?? 1,
    pageSize: url.searchParams.get("pageSize") ?? 20,
  });

  if (!queryParsed.success) {
    return Response.json(
      { error: "Invalid query params", details: queryParsed.error.flatten() },
      { status: 400 }
    );
  }

  const { from, to, status, page, pageSize } = queryParsed.data;

  const now = new Date();
  const fromDate = from
    ? new Date(from + "T00:00:00Z")
    : new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
  const toDate = to
    ? new Date(to + "T23:59:59Z")
    : new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 0, 23, 59, 59));

  const where = {
    date: { gte: fromDate, lte: toDate },
    ...(status !== "ALL" ? { status: status as "PRESENT" | "ABSENT" | "HALF_DAY" | "LEAVE" } : {}),
  };

  const [total, records] = await Promise.all([
    prisma.attendance.count({ where }),
    prisma.attendance.findMany({
      where,
      include: {
        user: {
          select: {
            fullName: true,
            employeeId: true,
            jobTitle: true,
            department: true,
          },
        },
      },
      orderBy: [{ date: "desc" }, { user: { fullName: "asc" } }],
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
  ]);

  return Response.json({
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
    from: fromDate.toISOString(),
    to: toDate.toISOString(),
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
      employee: r.user,
    })),
  });
}

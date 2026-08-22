import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import CheckInCard from "./CheckInCard";
import DailyStatus from "./DailyStatus";
import WeeklyView from "./WeeklyView";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Attendance — Dayflow",
  description: "Track your daily check-in, check-out, and weekly attendance summary.",
};

export default async function AttendancePage() {
  const session = await getSession();

  // Fetch today's record server-side for the initial render
  const now = new Date();
  const todayStart = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
  );
  const todayEnd = new Date(todayStart.getTime() + 24 * 60 * 60 * 1000 - 1);

  const todayRecord = session
    ? await prisma.attendance.findFirst({
        where: {
          userId: session.id,
          date: { gte: todayStart, lte: todayEnd },
        },
      })
    : null;

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950 px-4 py-10">
      <div className="mx-auto max-w-4xl space-y-6">

        {/* Page header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              Attendance
            </h1>
            <p className="mt-1 text-sm text-zinc-500">
              {session ? `Welcome back, ${session.name}` : "Please sign in"}
            </p>
          </div>
          {session?.role === "ADMIN" && (
            <a
              href="/attendance/admin"
              className="rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-700 shadow-sm transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700"
              id="admin-view-link"
            >
              Admin View →
            </a>
          )}
        </div>

        {/* Top row: Check-in card + Daily status */}
        <div className="grid gap-6 md:grid-cols-2">
          <CheckInCard />
          <DailyStatus
            status={(todayRecord?.status as "PRESENT" | "ABSENT" | "HALF_DAY" | "LEAVE") ?? null}
            checkIn={todayRecord?.checkIn?.toISOString() ?? null}
            checkOut={todayRecord?.checkOut?.toISOString() ?? null}
          />
        </div>

        {/* Weekly chart */}
        {session && (
          <WeeklyView employeeId={session.employeeId} />
        )}
      </div>
    </main>
  );
}

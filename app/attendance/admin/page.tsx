import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import AdminTable from "./AdminTable";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin — Attendance · Dayflow",
  description: "Full attendance records for all employees with date and status filters.",
};

export default async function AdminAttendancePage() {
  const session = await getSession();

  if (!session) redirect("/");
  if (session.role !== "ADMIN") redirect("/attendance");

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950 px-4 py-10">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              Attendance Records
            </h1>
            <p className="mt-1 text-sm text-zinc-500">All employees · filter by date and status</p>
          </div>
          <a
            href="/attendance"
            id="back-to-attendance"
            className="rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-700 shadow-sm transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700"
          >
            ← My Attendance
          </a>
        </div>

        <AdminTable />
      </div>
    </main>
  );
}

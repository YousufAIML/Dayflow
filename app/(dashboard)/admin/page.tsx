import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import StatCard from "@/components/admin/StatCard";
import EmployeeTable from "@/components/admin/EmployeeTable";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Admin · Team Overview" };

/* ── Icons ── */
function PeopleIcon() {
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></svg>;
}
function CheckIcon() {
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /><path d="M9 16l2 2 4-4" /></svg>;
}
function ClockIcon() {
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>;
}

export default async function AdminPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/signin");
  if (session.user.role !== "ADMIN") redirect("/dashboard");

  // ── Data fetching ──
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const [employees, todayAttendance, pendingLeaves] = await Promise.all([
    prisma.user.findMany({
      orderBy: { dateJoined: "desc" },
      select: {
        id: true,
        employeeId: true,
        fullName: true,
        email: true,
        role: true,
        department: true,
        jobTitle: true,
        dateJoined: true,
      },
    }),
    prisma.attendance.count({
      where: {
        date: { gte: today, lt: tomorrow },
        status: "PRESENT",
      },
    }),
    prisma.leaveRequest.count({
      where: { status: "PENDING" },
    }),
  ]);

  const serializedEmployees = employees.map((e) => ({
    ...e,
    dateJoined: e.dateJoined.toISOString(),
  }));

  return (
    <div style={{ padding: "2rem", maxWidth: 1100, margin: "0 auto" }}>
      {/* ── Header ── */}
      <div style={{ marginBottom: "2rem" }}>
        <h1
          style={{
            fontSize: "1.625rem",
            fontWeight: 700,
            color: "var(--color-text-primary)",
            margin: 0,
            marginBottom: "0.375rem",
          }}
        >
          Team Overview
        </h1>
        <p style={{ margin: 0, fontSize: "0.9375rem", color: "var(--color-text-muted)" }}>
          {new Date().toLocaleDateString("en-IN", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>

      {/* ── Stat Cards ── */}
      <section aria-label="Summary statistics" style={{ marginBottom: "2.5rem" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
            gap: "1rem",
          }}
        >
          <StatCard
            id="stat-total-employees"
            label="Total Employees"
            value={employees.length}
            icon={<PeopleIcon />}
            accent="var(--color-primary-500)"
            description="Across all departments"
          />
          <StatCard
            id="stat-present-today"
            label="Present Today"
            value={todayAttendance}
            icon={<CheckIcon />}
            accent="var(--color-success-500)"
            description={`of ${employees.length} employees`}
          />
          <Link href="/admin/leaves" style={{ textDecoration: "none" }}>
            <StatCard
              id="stat-pending-leaves"
              label="Pending Leaves"
              value={pendingLeaves}
              icon={<ClockIcon />}
              accent="var(--color-warning-500)"
              description="Awaiting your approval"
            />
          </Link>
        </div>
      </section>

      {/* ── Employee Table ── */}
      <section aria-label="Employee directory">
        <h2
          style={{
            fontSize: "0.8125rem",
            fontWeight: 600,
            letterSpacing: "0.05em",
            textTransform: "uppercase",
            color: "var(--color-text-muted)",
            marginBottom: "1rem",
            marginTop: 0,
          }}
        >
          All Employees
        </h2>
        <EmployeeTable employees={serializedEmployees} />
      </section>
    </div>
  );
}

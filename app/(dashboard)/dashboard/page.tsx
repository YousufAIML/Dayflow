import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { signOut } from "next-auth/react";
import QuickAccessCard from "@/components/dashboard/QuickAccessCard";
import ActivityFeed from "@/components/dashboard/ActivityFeed";
import type { ActivityEvent } from "@/components/dashboard/ActivityFeed";
import LogoutButton from "@/components/dashboard/LogoutButton";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Dashboard" };

/* ── Icon helpers ── */
function ProfileIcon() {
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" /></svg>;
}
function AttendanceIcon() {
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /><path d="M9 16l2 2 4-4" /></svg>;
}
function LeaveIcon() {
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="9" y1="13" x2="15" y2="13" /></svg>;
}
function LogoutIcon() {
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>;
}

/* ── Fetch activity events from DB ── */
async function getRecentActivity(userId: string): Promise<ActivityEvent[]> {
  const events: ActivityEvent[] = [];

  // Last 3 attendance records
  const attendances = await prisma.attendance.findMany({
    where: { userId },
    orderBy: { date: "desc" },
    take: 3,
  });

  for (const att of attendances) {
    if (att.checkIn) {
      events.push({
        id: `att-in-${att.id}`,
        type: "checkin",
        description: `Checked in at ${new Date(att.checkIn).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}`,
        timestamp: att.checkIn.toISOString(),
      });
    }
    if (att.checkOut) {
      events.push({
        id: `att-out-${att.id}`,
        type: "checkout",
        description: `Checked out at ${new Date(att.checkOut).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}`,
        timestamp: att.checkOut.toISOString(),
      });
    }
  }

  // Last 3 leave requests
  const leaves = await prisma.leaveRequest.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 3,
  });

  for (const leave of leaves) {
    const typeLabel = leave.type === "PAID" ? "Paid" : leave.type === "SICK" ? "Sick" : "Unpaid";
    if (leave.status === "PENDING") {
      events.push({
        id: `leave-req-${leave.id}`,
        type: "leave_requested",
        description: `${typeLabel} leave request submitted (${new Date(leave.startDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" })} – ${new Date(leave.endDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" })})`,
        timestamp: leave.createdAt.toISOString(),
      });
    } else if (leave.status === "APPROVED") {
      events.push({
        id: `leave-app-${leave.id}`,
        type: "leave_approved",
        description: `${typeLabel} leave approved`,
        timestamp: leave.createdAt.toISOString(),
      });
    } else if (leave.status === "REJECTED") {
      events.push({
        id: `leave-rej-${leave.id}`,
        type: "leave_rejected",
        description: `${typeLabel} leave request was declined`,
        timestamp: leave.createdAt.toISOString(),
      });
    }
  }

  // Sort by timestamp desc, take top 6
  return events
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 6);
}

/* ── Greeting ── */
function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

/* ── Dashboard Page ── */
export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/signin");

  // Admin should be on /admin
  if (session.user.role === "ADMIN") redirect("/admin");

  const userId = session.user.id;
  const userName = session.user.name ?? "there";
  const firstName = userName.split(" ")[0];

  const recentActivity = await getRecentActivity(userId);

  return (
    <div style={{ padding: "2rem", maxWidth: 900, margin: "0 auto" }}>
      {/* ── Greeting ── */}
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
          {getGreeting()}, {firstName} 👋
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

      {/* ── Quick Access Cards ── */}
      <section aria-label="Quick access" style={{ marginBottom: "2.5rem" }}>
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
          Quick Access
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
            gap: "1rem",
          }}
        >
          <QuickAccessCard
            id="quick-profile"
            href="/profile"
            icon={<ProfileIcon />}
            label="My Profile"
            description="View and update your personal details"
            accent="var(--color-primary-500)"
          />
          <QuickAccessCard
            id="quick-attendance"
            href="/attendance"
            icon={<AttendanceIcon />}
            label="Attendance"
            description="Check your attendance history"
            accent="var(--color-accent-500)"
          />
          <QuickAccessCard
            id="quick-leave"
            href="/leave"
            icon={<LeaveIcon />}
            label="Leave Requests"
            description="Apply for or track your leaves"
            accent="var(--color-warning-500)"
          />
          <LogoutButton />
        </div>
      </section>

      {/* ── Recent Activity ── */}
      <section aria-label="Recent activity">
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
          Recent Activity
        </h2>
        <div
          className="card"
          style={{ padding: "0.25rem 1.25rem" }}
        >
          <ActivityFeed events={recentActivity} />
        </div>
      </section>
    </div>
  );
}

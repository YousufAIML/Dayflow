import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Attendance" };

export default function AttendancePage() {
  return (
    <div style={{ padding: "2rem", maxWidth: 900, margin: "0 auto" }}>
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--color-text-primary)", margin: 0 }}>
          Attendance
        </h1>
        <p style={{ margin: "0.375rem 0 0", color: "var(--color-text-muted)", fontSize: "0.875rem" }}>
          Track your check-ins, check-outs, and daily attendance history.
        </p>
      </div>

      <div
        className="card"
        style={{
          padding: "3rem 2rem",
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "1rem",
        }}
      >
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: "var(--radius-lg)",
            background: "color-mix(in srgb, var(--color-accent-500) 12%, transparent)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--color-accent-500)",
          }}
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <rect x="3" y="4" width="18" height="18" rx="2" />
            <path d="M16 2v4M8 2v4M3 10h18" />
            <path d="M9 16l2 2 4-4" />
          </svg>
        </div>
        <div>
          <h2 style={{ fontWeight: 600, fontSize: "1.125rem", margin: "0 0 0.375rem", color: "var(--color-text-primary)" }}>
            Attendance module coming soon
          </h2>
          <p style={{ margin: 0, fontSize: "0.875rem", color: "var(--color-text-muted)", maxWidth: 360 }}>
            This page is being built by a teammate. The nav link is wired and ready — check back soon!
          </p>
        </div>
        <Link href="/dashboard" className="btn-ghost" style={{ marginTop: "0.5rem", fontSize: "0.8125rem" }}>
          ← Back to Dashboard
        </Link>
      </div>
    </div>
  );
}

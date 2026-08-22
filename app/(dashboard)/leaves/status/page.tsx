import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Leave Status" };

export default function LeaveStatusPage() {
  return (
    <div style={{ padding: "2rem", maxWidth: 900, margin: "0 auto" }}>
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--color-text-primary)", margin: 0 }}>
          Leave Status & History
        </h1>
        <p style={{ margin: "0.375rem 0 0", color: "var(--color-text-muted)", fontSize: "0.875rem" }}>
          Track your past and upcoming time-off requests.
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
            background: "color-mix(in srgb, var(--color-warning-500) 12%, transparent)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--color-warning-500)",
          }}
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="9" y1="13" x2="15" y2="13" />
            <line x1="9" y1="17" x2="11" y2="17" />
          </svg>
        </div>
        <div>
          <h2 style={{ fontWeight: 600, fontSize: "1.125rem", margin: "0 0 0.375rem", color: "var(--color-text-primary)" }}>
            Leave history coming soon
          </h2>
          <p style={{ margin: 0, fontSize: "0.875rem", color: "var(--color-text-muted)", maxWidth: 360 }}>
            The detailed leave history and status tracking module is currently being built by a teammate. Check back soon!
          </p>
        </div>
        <Link href="/leaves" className="btn-ghost" style={{ marginTop: "0.5rem", fontSize: "0.8125rem" }}>
          ← Back to Apply Leave
        </Link>
      </div>
    </div>
  );
}

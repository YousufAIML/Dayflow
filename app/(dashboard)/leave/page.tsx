import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Leave Requests" };

export default function LeavePage() {
  return (
    <div style={{ padding: "2rem", maxWidth: 900, margin: "0 auto" }}>
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--color-text-primary)", margin: 0 }}>
          Leave Requests
        </h1>
        <p style={{ margin: "0.375rem 0 0", color: "var(--color-text-muted)", fontSize: "0.875rem" }}>
          Apply for leaves, track approvals, and manage your leave balance.
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
            Leave management coming soon
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

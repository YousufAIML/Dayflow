"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type LeaveStatus = "PENDING" | "APPROVED" | "REJECTED";

interface LeaveRequest {
  id: string;
  type: string;
  startDate: string;
  endDate: string;
  status: LeaveStatus;
  remarks: string | null;
  createdAt: string;
  user: {
    id: string;
    fullName: string;
    employeeId: string;
    department: string | null;
    jobTitle: string | null;
  };
}

export default function AdminLeaveManagementPage() {
  const [leaves, setLeaves] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [processingId, setProcessingId] = useState<string | null>(null);
  const router = useRouter();

  const fetchLeaves = async () => {
    try {
      const res = await fetch("/api/admin/leaves");
      if (!res.ok) {
        if (res.status === 401) {
          router.push("/dashboard");
          return;
        }
        throw new Error("Failed to fetch leaves data");
      }
      const json = await res.json();
      if (json.success) {
        setLeaves(json.data.leaves);
      } else {
        throw new Error(json.error || "Unknown error");
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error loading data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchLeaves();
  }, []);

  const handleStatusUpdate = async (id: string, newStatus: "APPROVED" | "REJECTED") => {
    setProcessingId(id);
    try {
      const res = await fetch(`/api/admin/leaves/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });
      
      const json = await res.json();
      if (json.success) {
        // Refresh the list
        setLeaves(leaves.map(l => l.id === id ? { ...l, status: newStatus } : l));
      } else {
        alert(`Error: ${json.error}`);
      }
    } catch (error) {
      console.error(error);
      alert("An unexpected error occurred.");
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: "2rem", maxWidth: 1100, margin: "0 auto" }}>
        <h1 style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--color-text-primary)", marginBottom: "2rem" }}>
          Leave Management
        </h1>
        <div className="card" style={{ padding: "3rem", textAlign: "center", color: "var(--color-text-muted)" }}>
          Loading leave requests...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: "2rem", maxWidth: 1100, margin: "0 auto" }}>
        <div className="card" style={{ padding: "2rem", color: "var(--color-error-500)" }}>
          Error: {error}
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: "2rem", maxWidth: 1100, margin: "0 auto" }}>
      <div style={{ marginBottom: "2rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <Link href="/admin" style={{ fontSize: "0.875rem", color: "var(--color-primary-600)", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "0.25rem", marginBottom: "0.5rem", fontWeight: 500 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            Back to Overview
          </Link>
          <h1 style={{ fontSize: "1.625rem", fontWeight: 700, color: "var(--color-text-primary)", margin: 0 }}>
            Leave Management
          </h1>
          <p style={{ margin: "0.375rem 0 0", color: "var(--color-text-muted)", fontSize: "0.9375rem" }}>
            Review and manage employee time-off requests.
          </p>
        </div>
      </div>

      <div className="card" style={{ overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--color-border)", backgroundColor: "var(--color-surface-elevated)" }}>
                <th style={{ padding: "1rem", fontSize: "0.75rem", fontWeight: 600, color: "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Employee</th>
                <th style={{ padding: "1rem", fontSize: "0.75rem", fontWeight: 600, color: "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Type</th>
                <th style={{ padding: "1rem", fontSize: "0.75rem", fontWeight: 600, color: "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Duration</th>
                <th style={{ padding: "1rem", fontSize: "0.75rem", fontWeight: 600, color: "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Requested On</th>
                <th style={{ padding: "1rem", fontSize: "0.75rem", fontWeight: 600, color: "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Status</th>
                <th style={{ padding: "1rem", fontSize: "0.75rem", fontWeight: 600, color: "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {leaves.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ padding: "3rem", textAlign: "center", color: "var(--color-text-muted)" }}>
                    No leave requests found.
                  </td>
                </tr>
              ) : (
                leaves.map((leave) => {
                  const start = new Date(leave.startDate);
                  const end = new Date(leave.endDate);
                  const requested = new Date(leave.createdAt);
                  const isPending = leave.status === "PENDING";
                  
                  return (
                    <tr key={leave.id} style={{ borderBottom: "1px solid var(--color-border)" }}>
                      <td style={{ padding: "1rem" }}>
                        <div style={{ fontWeight: 600, color: "var(--color-text-primary)", fontSize: "0.875rem" }}>
                          {leave.user.fullName}
                        </div>
                        <div style={{ color: "var(--color-text-muted)", fontSize: "0.75rem", marginTop: "0.125rem" }}>
                          {leave.user.employeeId} &middot; {leave.user.department || "No Dept"}
                        </div>
                      </td>
                      <td style={{ padding: "1rem", fontSize: "0.875rem", color: "var(--color-text-primary)", fontWeight: 500 }}>
                        {leave.type}
                      </td>
                      <td style={{ padding: "1rem", fontSize: "0.8125rem", color: "var(--color-text-secondary)" }}>
                        {start.toLocaleDateString()} &mdash; {end.toLocaleDateString()}
                      </td>
                      <td style={{ padding: "1rem", fontSize: "0.8125rem", color: "var(--color-text-secondary)" }}>
                        {requested.toLocaleDateString()}
                      </td>
                      <td style={{ padding: "1rem" }}>
                        <span 
                          style={{
                            padding: "0.25rem 0.625rem",
                            borderRadius: "9999px",
                            fontSize: "0.75rem",
                            fontWeight: 600,
                            backgroundColor: leave.status === "APPROVED" 
                              ? "color-mix(in srgb, var(--color-success-500) 15%, transparent)" 
                              : leave.status === "REJECTED"
                              ? "color-mix(in srgb, var(--color-error-500) 15%, transparent)"
                              : "color-mix(in srgb, var(--color-warning-500) 15%, transparent)",
                            color: leave.status === "APPROVED" 
                              ? "var(--color-success-600)" 
                              : leave.status === "REJECTED"
                              ? "var(--color-error-600)"
                              : "var(--color-warning-600)",
                          }}
                        >
                          {leave.status}
                        </span>
                      </td>
                      <td style={{ padding: "1rem", textAlign: "right" }}>
                        {isPending ? (
                          <div style={{ display: "flex", gap: "0.5rem", justifyContent: "flex-end" }}>
                            <button
                              disabled={processingId === leave.id}
                              onClick={() => handleStatusUpdate(leave.id, "APPROVED")}
                              style={{
                                padding: "0.375rem 0.75rem",
                                fontSize: "0.75rem",
                                fontWeight: 500,
                                borderRadius: "var(--radius-md)",
                                backgroundColor: "var(--color-success-600)",
                                color: "white",
                                border: "none",
                                cursor: processingId === leave.id ? "not-allowed" : "pointer",
                                opacity: processingId === leave.id ? 0.7 : 1,
                              }}
                            >
                              Approve
                            </button>
                            <button
                              disabled={processingId === leave.id}
                              onClick={() => handleStatusUpdate(leave.id, "REJECTED")}
                              style={{
                                padding: "0.375rem 0.75rem",
                                fontSize: "0.75rem",
                                fontWeight: 500,
                                borderRadius: "var(--radius-md)",
                                backgroundColor: "transparent",
                                color: "var(--color-error-600)",
                                border: "1px solid var(--color-error-300)",
                                cursor: processingId === leave.id ? "not-allowed" : "pointer",
                                opacity: processingId === leave.id ? 0.7 : 1,
                              }}
                            >
                              Reject
                            </button>
                          </div>
                        ) : (
                          <span style={{ fontSize: "0.75rem", color: "var(--color-text-muted)", fontStyle: "italic" }}>
                            Processed
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

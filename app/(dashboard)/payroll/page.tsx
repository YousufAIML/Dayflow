"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Payslip {
  id: string;
  month: number;
  year: number;
  basicSalary: number;
  allowances: number;
  deductions: number;
  netPay: number;
  status: "PAID" | "PENDING";
  generatedAt: string;
}

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function PayrollPage() {
  const [payslips, setPayslips] = useState<Payslip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchPayroll() {
      try {
        const res = await fetch("/api/payroll");
        if (!res.ok) {
          throw new Error("Failed to fetch payroll data");
        }
        const json = await res.json();
        if (json.success) {
          setPayslips(json.data.payslips);
        } else {
          throw new Error(json.error || "Unknown error");
        }
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Error loading data");
      } finally {
        setLoading(false);
      }
    }
    fetchPayroll();
  }, []);

  if (loading) {
    return (
      <div style={{ padding: "2rem", maxWidth: 900, margin: "0 auto" }}>
        <div style={{ marginBottom: "2rem" }}>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--color-text-primary)", margin: 0 }}>
            Payroll
          </h1>
          <p style={{ margin: "0.375rem 0 0", color: "var(--color-text-muted)", fontSize: "0.875rem" }}>
            Loading your salary information...
          </p>
        </div>
        <div className="card" style={{ padding: "3rem", textAlign: "center" }}>
          <div style={{ color: "var(--color-text-muted)" }}>Loading...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: "2rem", maxWidth: 900, margin: "0 auto" }}>
        <div className="card" style={{ padding: "2rem", color: "var(--color-error-500)" }}>
          Error: {error}
        </div>
      </div>
    );
  }

  const latest = payslips.length > 0 ? payslips[0] : null;
  const history = payslips.slice(1);

  return (
    <div style={{ padding: "2rem", maxWidth: 900, margin: "0 auto" }}>
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--color-text-primary)", margin: 0 }}>
          Payroll
        </h1>
        <p style={{ margin: "0.375rem 0 0", color: "var(--color-text-muted)", fontSize: "0.875rem" }}>
          View your salary slips, deductions, and payment history.
        </p>
      </div>

      {!latest ? (
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
              background: "color-mix(in srgb, var(--color-success-500) 12%, transparent)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--color-success-500)",
            }}
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="2" y="5" width="20" height="14" rx="2" />
              <path d="M2 10h20" />
              <path d="M7 15h.01M11 15h2" />
            </svg>
          </div>
          <div>
            <h2 style={{ fontWeight: 600, fontSize: "1.125rem", margin: "0 0 0.375rem", color: "var(--color-text-primary)" }}>
              No Payslips Available
            </h2>
            <p style={{ margin: 0, fontSize: "0.875rem", color: "var(--color-text-muted)", maxWidth: 360 }}>
              You don&apos;t have any generated payslips yet. They will appear here once processed by HR.
            </p>
          </div>
        </div>
      ) : (
        <>
          {/* Summary Card for Most Recent Payslip */}
          <div className="card" style={{ padding: "2rem", marginBottom: "2rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
              <div>
                <h2 style={{ fontSize: "1.125rem", fontWeight: 600, margin: 0, color: "var(--color-text-primary)" }}>
                  Current Payslip
                </h2>
                <p style={{ margin: "0.25rem 0 0", fontSize: "0.875rem", color: "var(--color-text-muted)" }}>
                  {MONTH_NAMES[latest.month - 1]} {latest.year}
                </p>
              </div>
              <span 
                style={{
                  padding: "0.375rem 0.75rem",
                  borderRadius: "9999px",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  backgroundColor: latest.status === "PAID" ? "color-mix(in srgb, var(--color-success-500) 15%, transparent)" : "color-mix(in srgb, var(--color-warning-500) 15%, transparent)",
                  color: latest.status === "PAID" ? "var(--color-success-600)" : "var(--color-warning-600)",
                }}
              >
                {latest.status}
              </span>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1.5rem" }}>
              <div style={{ padding: "1rem", backgroundColor: "var(--color-surface-elevated)", borderRadius: "var(--radius-lg)", border: "1px solid var(--color-border)" }}>
                <p style={{ margin: "0 0 0.5rem", fontSize: "0.75rem", color: "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  Basic Salary
                </p>
                <p style={{ margin: 0, fontSize: "1.25rem", fontWeight: 600, color: "var(--color-text-primary)" }}>
                  {formatCurrency(latest.basicSalary)}
                </p>
              </div>
              
              <div style={{ padding: "1rem", backgroundColor: "var(--color-surface-elevated)", borderRadius: "var(--radius-lg)", border: "1px solid var(--color-border)" }}>
                <p style={{ margin: "0 0 0.5rem", fontSize: "0.75rem", color: "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  Allowances
                </p>
                <p style={{ margin: 0, fontSize: "1.25rem", fontWeight: 600, color: "var(--color-success-600)" }}>
                  +{formatCurrency(latest.allowances)}
                </p>
              </div>

              <div style={{ padding: "1rem", backgroundColor: "var(--color-surface-elevated)", borderRadius: "var(--radius-lg)", border: "1px solid var(--color-border)" }}>
                <p style={{ margin: "0 0 0.5rem", fontSize: "0.75rem", color: "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  Deductions
                </p>
                <p style={{ margin: 0, fontSize: "1.25rem", fontWeight: 600, color: "var(--color-error-600)" }}>
                  -{formatCurrency(latest.deductions)}
                </p>
              </div>

              <div style={{ padding: "1.25rem", backgroundColor: "color-mix(in srgb, var(--color-primary-500) 10%, transparent)", borderRadius: "var(--radius-lg)", border: "1px solid color-mix(in srgb, var(--color-primary-500) 20%, transparent)" }}>
                <p style={{ margin: "0 0 0.5rem", fontSize: "0.875rem", color: "var(--color-primary-700)", fontWeight: 600 }}>
                  Net Pay
                </p>
                <p style={{ margin: 0, fontSize: "1.5rem", fontWeight: 700, color: "var(--color-primary-700)" }}>
                  {formatCurrency(latest.netPay)}
                </p>
              </div>
            </div>
          </div>

          {/* History Table */}
          {history.length > 0 && (
            <div className="card" style={{ padding: "2rem" }}>
              <h2 style={{ fontSize: "1.125rem", fontWeight: 600, margin: "0 0 1.5rem", color: "var(--color-text-primary)" }}>
                Past Payslips
              </h2>
              
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                  <thead>
                    <tr style={{ borderBottom: "1px solid var(--color-border)" }}>
                      <th style={{ padding: "0.75rem 1rem", fontSize: "0.75rem", fontWeight: 600, color: "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Period</th>
                      <th style={{ padding: "0.75rem 1rem", fontSize: "0.75rem", fontWeight: 600, color: "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Net Pay</th>
                      <th style={{ padding: "0.75rem 1rem", fontSize: "0.75rem", fontWeight: 600, color: "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Status</th>
                      <th style={{ padding: "0.75rem 1rem", fontSize: "0.75rem", fontWeight: 600, color: "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", textAlign: "right" }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.map((slip) => (
                      <tr key={slip.id} style={{ borderBottom: "1px solid var(--color-border)" }}>
                        <td style={{ padding: "1rem", fontSize: "0.875rem", color: "var(--color-text-primary)", fontWeight: 500 }}>
                          {MONTH_NAMES[slip.month - 1]} {slip.year}
                        </td>
                        <td style={{ padding: "1rem", fontSize: "0.875rem", color: "var(--color-text-primary)" }}>
                          {formatCurrency(slip.netPay)}
                        </td>
                        <td style={{ padding: "1rem" }}>
                          <span 
                            style={{
                              padding: "0.25rem 0.5rem",
                              borderRadius: "9999px",
                              fontSize: "0.6875rem",
                              fontWeight: 600,
                              backgroundColor: slip.status === "PAID" ? "color-mix(in srgb, var(--color-success-500) 15%, transparent)" : "color-mix(in srgb, var(--color-warning-500) 15%, transparent)",
                              color: slip.status === "PAID" ? "var(--color-success-600)" : "var(--color-warning-600)",
                            }}
                          >
                            {slip.status}
                          </span>
                        </td>
                        <td style={{ padding: "1rem", textAlign: "right" }}>
                          <button className="btn-ghost" style={{ fontSize: "0.75rem", padding: "0.375rem 0.75rem" }}>
                            Download PDF
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

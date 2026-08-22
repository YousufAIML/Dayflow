"use client";

import { useState, useMemo } from "react";
import Link from "next/link";

interface Employee {
  id: string;
  employeeId: string;
  fullName: string | null;
  email: string;
  role: string;
  department: string | null;
  jobTitle: string | null;
  dateJoined: string;
}

interface EmployeeTableProps {
  employees: Employee[];
}

function getRoleLabel(role: string) {
  return role === "ADMIN" ? "Admin" : "Employee";
}

function getBadgeStyle(role: string): React.CSSProperties {
  return role === "ADMIN"
    ? {
        background: "color-mix(in srgb, var(--color-primary-500) 12%, transparent)",
        color: "var(--color-primary-600)",
        border: "1px solid color-mix(in srgb, var(--color-primary-500) 30%, transparent)",
      }
    : {
        background: "var(--color-surface-elevated)",
        color: "var(--color-text-muted)",
        border: "1px solid var(--color-border)",
      };
}

function Avatar({ name, size = 32 }: { name: string | null; size?: number }) {
  const initials = (name ?? "?")
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: "color-mix(in srgb, var(--color-primary-500) 18%, transparent)",
        color: "var(--color-primary-600)",
        fontWeight: 700,
        fontSize: size * 0.38,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        letterSpacing: "0.02em",
      }}
    >
      {initials}
    </div>
  );
}

export default function EmployeeTable({ employees }: EmployeeTableProps) {
  const [search, setSearch] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");

  const departments = useMemo(() => {
    const depts = employees
      .map((e) => e.department)
      .filter((d): d is string => !!d);
    return Array.from(new Set(depts)).sort();
  }, [employees]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return employees.filter((e) => {
      const matchesSearch =
        !q ||
        (e.fullName ?? "").toLowerCase().includes(q) ||
        e.email.toLowerCase().includes(q) ||
        e.employeeId.toLowerCase().includes(q) ||
        (e.department ?? "").toLowerCase().includes(q) ||
        (e.jobTitle ?? "").toLowerCase().includes(q);
      const matchesDept = departmentFilter === "all" || e.department === departmentFilter;
      const matchesRole = roleFilter === "all" || e.role === roleFilter;
      return matchesSearch && matchesDept && matchesRole;
    });
  }, [employees, search, departmentFilter, roleFilter]);

  return (
    <div>
      {/* Filters row */}
      <div
        style={{
          display: "flex",
          gap: "0.75rem",
          marginBottom: "1rem",
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        {/* Search */}
        <div style={{ position: "relative", flex: "1 1 220px", minWidth: 180 }}>
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
              position: "absolute",
              left: "0.75rem",
              top: "50%",
              transform: "translateY(-50%)",
              color: "var(--color-text-muted)",
              pointerEvents: "none",
            }}
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            id="employee-search"
            type="search"
            placeholder="Search employees…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input"
            style={{ paddingLeft: "2.5rem" }}
          />
        </div>

        {/* Department filter */}
        {departments.length > 0 && (
          <select
            id="dept-filter"
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="input"
            style={{ flex: "0 1 160px", cursor: "pointer" }}
          >
            <option value="all">All Departments</option>
            {departments.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        )}

        {/* Role filter */}
        <select
          id="role-filter"
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="input"
          style={{ flex: "0 1 130px", cursor: "pointer" }}
        >
          <option value="all">All Roles</option>
          <option value="EMPLOYEE">Employee</option>
          <option value="ADMIN">Admin</option>
        </select>

        <span style={{ fontSize: "0.8125rem", color: "var(--color-text-muted)", whiteSpace: "nowrap" }}>
          {filtered.length} of {employees.length}
        </span>
      </div>

      {/* Table */}
      <div
        style={{
          overflowX: "auto",
          border: "1px solid var(--color-border)",
          borderRadius: "var(--radius-lg)",
        }}
      >
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr
              style={{
                background: "var(--color-surface-elevated)",
                borderBottom: "1px solid var(--color-border)",
              }}
            >
              {["Employee", "ID", "Department", "Job Title", "Role", "Joined"].map((col) => (
                <th
                  key={col}
                  style={{
                    padding: "0.75rem 1rem",
                    textAlign: "left",
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    letterSpacing: "0.04em",
                    textTransform: "uppercase",
                    color: "var(--color-text-muted)",
                    whiteSpace: "nowrap",
                  }}
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  style={{
                    padding: "3rem 1rem",
                    textAlign: "center",
                    color: "var(--color-text-muted)",
                    fontSize: "0.875rem",
                  }}
                >
                  No employees match your search
                </td>
              </tr>
            ) : (
              filtered.map((emp, idx) => (
                <tr
                  key={emp.id}
                  style={{
                    borderBottom:
                      idx < filtered.length - 1
                        ? "1px solid var(--color-border-subtle)"
                        : "none",
                    transition: "background-color var(--transition-fast)",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLTableRowElement).style.backgroundColor =
                      "var(--color-surface-hover)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLTableRowElement).style.backgroundColor = "transparent";
                  }}
                >
                  {/* Employee name + email */}
                  <td style={{ padding: "0.875rem 1rem" }}>
                    <Link
                      href={`/admin/employees/${emp.id}`}
                      style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "0.75rem" }}
                    >
                      <Avatar name={emp.fullName} />
                      <div>
                        <div style={{ fontWeight: 500, fontSize: "0.875rem", color: "var(--color-text-primary)" }}>
                          {emp.fullName ?? "—"}
                        </div>
                        <div style={{ fontSize: "0.75rem", color: "var(--color-text-muted)" }}>{emp.email}</div>
                      </div>
                    </Link>
                  </td>
                  <td style={{ padding: "0.875rem 1rem", fontSize: "0.875rem", color: "var(--color-text-secondary)", fontFamily: "monospace" }}>
                    {emp.employeeId}
                  </td>
                  <td style={{ padding: "0.875rem 1rem", fontSize: "0.875rem", color: "var(--color-text-secondary)" }}>
                    {emp.department ?? <span style={{ color: "var(--color-text-muted)" }}>—</span>}
                  </td>
                  <td style={{ padding: "0.875rem 1rem", fontSize: "0.875rem", color: "var(--color-text-secondary)" }}>
                    {emp.jobTitle ?? <span style={{ color: "var(--color-text-muted)" }}>—</span>}
                  </td>
                  <td style={{ padding: "0.875rem 1rem" }}>
                    <span
                      className="badge"
                      style={getBadgeStyle(emp.role)}
                    >
                      {getRoleLabel(emp.role)}
                    </span>
                  </td>
                  <td style={{ padding: "0.875rem 1rem", fontSize: "0.8125rem", color: "var(--color-text-muted)", whiteSpace: "nowrap" }}>
                    {new Date(emp.dateJoined).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

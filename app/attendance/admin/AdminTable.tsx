"use client";

import { useCallback, useEffect, useState, useTransition } from "react";

type AttendanceRecord = {
  id: string;
  date: string;
  checkIn: string | null;
  checkOut: string | null;
  status: "PRESENT" | "ABSENT" | "HALF_DAY" | "LEAVE";
  durationMinutes: number | null;
  employee: {
    fullName: string | null;
    employeeId: string;
    jobTitle: string | null;
    department: string | null;
  };
};

type ApiResponse = {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  records: AttendanceRecord[];
};

const STATUS_CONFIG = {
  PRESENT:  { label: "Present",  color: "#10b981", bg: "rgba(16,185,129,0.12)" },
  ABSENT:   { label: "Absent",   color: "#ef4444", bg: "rgba(239,68,68,0.12)" },
  HALF_DAY: { label: "Half Day", color: "#f59e0b", bg: "rgba(245,158,11,0.12)" },
  LEAVE:    { label: "On Leave", color: "#6366f1", bg: "rgba(99,102,241,0.12)" },
  ALL:      { label: "All",      color: "#71717a", bg: "transparent" },
};

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "2-digit", month: "short", year: "numeric",
  });
}
function fmtTime(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true });
}

export default function AdminTable() {
  const today = new Date();
  const firstOfMonth = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), 1))
    .toISOString().slice(0, 10);
  const todayStr = today.toISOString().slice(0, 10);

  const [from, setFrom] = useState(firstOfMonth);
  const [to, setTo]     = useState(todayStr);
  const [status, setStatus] = useState<"ALL" | "PRESENT" | "ABSENT" | "HALF_DAY" | "LEAVE">("ALL");
  const [page, setPage] = useState(1);
  const [data, setData] = useState<ApiResponse | null>(null);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(
    (f: string, t: string, s: string, p: number) => {
      startTransition(async () => {
        setError(null);
        const params = new URLSearchParams({ from: f, to: t, status: s, page: String(p), pageSize: "15" });
        const res = await fetch(`/api/attendance/admin?${params}`);
        const json = await res.json();
        if (!res.ok) { setError(json.error); return; }
        setData(json);
      });
    },
    []
  );

  useEffect(() => {
    fetchData(from, to, status, page);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const applyFilters = () => {
    setPage(1);
    fetchData(from, to, status, 1);
  };

  const totalPresent = data?.records.filter((r) => r.status === "PRESENT").length ?? 0;
  const totalAbsent  = data?.records.filter((r) => r.status === "ABSENT").length ?? 0;

  return (
    <div className="space-y-6">
      {/* Summary stats */}
      {data && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { label: "Total Records", value: data.total, color: "text-zinc-700 dark:text-zinc-200" },
            { label: "Present (page)", value: totalPresent, color: "text-emerald-600 dark:text-emerald-400" },
            { label: "Absent (page)",  value: totalAbsent,  color: "text-red-500 dark:text-red-400" },
            { label: "Pages",          value: data.totalPages, color: "text-indigo-600 dark:text-indigo-400" },
          ].map(({ label, value, color }) => (
            <div key={label} className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-800">
              <p className="text-xs uppercase tracking-wider text-zinc-400">{label}</p>
              <p className={`mt-1 text-2xl font-bold ${color}`}>{value}</p>
            </div>
          ))}
        </div>
      )}

      {/* Filter bar */}
      <div className="flex flex-wrap items-end gap-3 rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-800">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-zinc-500" htmlFor="admin-filter-from">From</label>
          <input
            id="admin-filter-from"
            type="date"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm dark:border-zinc-600 dark:bg-zinc-700 dark:text-zinc-100"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-zinc-500" htmlFor="admin-filter-to">To</label>
          <input
            id="admin-filter-to"
            type="date"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm dark:border-zinc-600 dark:bg-zinc-700 dark:text-zinc-100"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-zinc-500" htmlFor="admin-filter-status">Status</label>
          <select
            id="admin-filter-status"
            value={status}
            onChange={(e) => setStatus(e.target.value as typeof status)}
            className="rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm dark:border-zinc-600 dark:bg-zinc-700 dark:text-zinc-100"
          >
            {Object.entries(STATUS_CONFIG).map(([k, v]) => (
              <option key={k} value={k}>{v.label}</option>
            ))}
          </select>
        </div>
        <button
          id="admin-filter-apply"
          onClick={applyFilters}
          className="rounded-lg bg-indigo-600 px-5 py-2 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors"
        >
          Apply
        </button>
      </div>

      {/* Error */}
      {error && (
        <p role="alert" className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600 dark:bg-red-950/30 dark:text-red-400">
          {error}
        </p>
      )}

      {/* Table */}
      <div
        className="overflow-hidden rounded-xl border border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-800 transition-opacity duration-300"
        style={{ opacity: isPending ? 0.5 : 1 }}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm" id="admin-attendance-table">
            <thead>
              <tr className="border-b border-zinc-100 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900">
                {["Employee", "Dept", "Date", "Check In", "Check Out", "Duration", "Status"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-zinc-400">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-700/50">
              {data?.records.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-sm text-zinc-400">
                    No records found for the selected filters.
                  </td>
                </tr>
              )}
              {data?.records.map((r) => {
                const cfg = STATUS_CONFIG[r.status];
                const dur = r.durationMinutes
                  ? `${Math.floor(r.durationMinutes / 60)}h ${r.durationMinutes % 60}m`
                  : "—";
                return (
                  <tr key={r.id} className="transition-colors hover:bg-zinc-50/50 dark:hover:bg-zinc-700/20">
                    <td className="px-4 py-3">
                      <p className="font-medium text-zinc-800 dark:text-zinc-100">{r.employee.fullName ?? "—"}</p>
                      <p className="text-xs text-zinc-400">{r.employee.employeeId}</p>
                    </td>
                    <td className="px-4 py-3 text-zinc-500 dark:text-zinc-400">{r.employee.department ?? "—"}</td>
                    <td className="px-4 py-3 font-mono text-xs text-zinc-600 dark:text-zinc-300">{fmtDate(r.date)}</td>
                    <td className="px-4 py-3 font-mono text-xs text-emerald-600 dark:text-emerald-400">{fmtTime(r.checkIn)}</td>
                    <td className="px-4 py-3 font-mono text-xs text-rose-500 dark:text-rose-400">{fmtTime(r.checkOut)}</td>
                    <td className="px-4 py-3 text-xs text-zinc-500">{dur}</td>
                    <td className="px-4 py-3">
                      <span
                        className="inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold"
                        style={{ color: cfg.color, background: cfg.bg }}
                      >
                        {cfg.label}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {data && data.totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-zinc-100 px-4 py-3 dark:border-zinc-700">
            <p className="text-xs text-zinc-400">
              Page {data.page} of {data.totalPages} · {data.total} total records
            </p>
            <div className="flex gap-2">
              <button
                id="admin-prev-page"
                disabled={data.page <= 1}
                onClick={() => { const p = page - 1; setPage(p); fetchData(from, to, status, p); }}
                className="rounded-lg border border-zinc-200 px-3 py-1.5 text-xs font-medium disabled:opacity-40 hover:bg-zinc-50 dark:border-zinc-600 dark:hover:bg-zinc-700"
              >
                ← Prev
              </button>
              <button
                id="admin-next-page"
                disabled={data.page >= data.totalPages}
                onClick={() => { const p = page + 1; setPage(p); fetchData(from, to, status, p); }}
                className="rounded-lg border border-zinc-200 px-3 py-1.5 text-xs font-medium disabled:opacity-40 hover:bg-zinc-50 dark:border-zinc-600 dark:hover:bg-zinc-700"
              >
                Next →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

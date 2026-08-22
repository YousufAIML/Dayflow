"use client";

import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

type DayRecord = {
  id: string;
  date: string;
  checkIn: string | null;
  checkOut: string | null;
  status: "PRESENT" | "ABSENT" | "HALF_DAY" | "LEAVE";
  durationMinutes: number | null;
};

type WeekData = {
  name: string; // "Mon", "Tue", …
  date: string;
  status: DayRecord["status"] | "WEEKEND" | "NO_DATA";
  hours: number;
  checkIn: string | null;
  checkOut: string | null;
};

const STATUS_COLORS: Record<string, string> = {
  PRESENT: "#10b981",
  HALF_DAY: "#f59e0b",
  ABSENT: "#ef4444",
  LEAVE: "#6366f1",
  WEEKEND: "#e4e4e7",
  NO_DATA: "#d1d5db",
};

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function buildWeekGrid(records: DayRecord[]): WeekData[] {
  const today = new Date();
  const dow = today.getUTCDay();
  const mondayOffset = dow === 0 ? -6 : 1 - dow;
  const monday = new Date(
    Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate() + mondayOffset)
  );

  const recordMap = new Map(
    records.map((r) => [r.date.slice(0, 10), r])
  );

  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday.getTime() + i * 86400000);
    const key = d.toISOString().slice(0, 10);
    const weekday = d.getUTCDay();
    const name = DAY_NAMES[weekday];

    if (weekday === 0 || weekday === 6) {
      return { name, date: key, status: "WEEKEND", hours: 0, checkIn: null, checkOut: null };
    }

    const rec = recordMap.get(key);
    if (!rec) {
      return { name, date: key, status: "NO_DATA", hours: 0, checkIn: null, checkOut: null };
    }

    return {
      name,
      date: key,
      status: rec.status,
      hours: rec.durationMinutes ? parseFloat((rec.durationMinutes / 60).toFixed(1)) : 0,
      checkIn: rec.checkIn,
      checkOut: rec.checkOut,
    };
  });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload as WeekData;
  const fmt = (iso: string | null) =>
    iso
      ? new Date(iso).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true })
      : "—";

  const statusLabel: Record<string, string> = {
    PRESENT: "Present",
    HALF_DAY: "Half Day",
    ABSENT: "Absent",
    LEAVE: "On Leave",
    WEEKEND: "Weekend",
    NO_DATA: "No record",
  };

  return (
    <div className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-xs shadow-lg dark:border-zinc-700 dark:bg-zinc-800">
      <p className="font-semibold text-zinc-800 dark:text-zinc-100">{label} · {d.date}</p>
      <p className="mt-1 text-zinc-500">Status: <span className="font-medium text-zinc-800 dark:text-zinc-100">{statusLabel[d.status]}</span></p>
      {d.hours > 0 && <p className="text-zinc-500">Hours: <span className="font-medium text-zinc-800 dark:text-zinc-100">{d.hours}h</span></p>}
      {d.checkIn && <p className="text-zinc-500">In: <span className="font-medium">{fmt(d.checkIn)}</span> · Out: <span className="font-medium">{fmt(d.checkOut)}</span></p>}
    </div>
  );
}

export default function WeeklyView({ employeeId }: { employeeId: string }) {
  const [weekData, setWeekData] = useState<WeekData[]>([]);
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/attendance/${encodeURIComponent(employeeId)}?range=weekly`)
      .then((r) => r.json())
      .then((data) => {
        if (data.records) {
          setWeekData(buildWeekGrid(data.records));
        }
        setLoading(false);
        // Trigger staggered entrance after data loads
        requestAnimationFrame(() => setVisible(true));
      })
      .catch(() => setLoading(false));
  }, [employeeId]);

  const legend = [
    { key: "PRESENT", label: "Present" },
    { key: "HALF_DAY", label: "Half Day" },
    { key: "ABSENT", label: "Absent" },
    { key: "LEAVE", label: "On Leave" },
  ];

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-400">
            This Week
          </h2>
          <p className="mt-0.5 text-sm font-medium text-zinc-700 dark:text-zinc-200">
            Attendance Overview
          </p>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-3">
          {legend.map(({ key, label }) => (
            <span key={key} className="flex items-center gap-1.5 text-xs text-zinc-500">
              <span
                className="h-2.5 w-2.5 rounded-sm"
                style={{ background: STATUS_COLORS[key] }}
              />
              {label}
            </span>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex h-48 items-center justify-center">
          <svg className="h-6 w-6 animate-spin text-zinc-400" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
          </svg>
        </div>
      ) : (
        <>
          {/* Bar chart */}
          <div
            id="weekly-bar-chart"
            className="h-48 transition-opacity duration-700"
            style={{ opacity: visible ? 1 : 0 }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weekData} barSize={28} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 12, fill: "#71717a" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "#71717a" }}
                  axisLine={false}
                  tickLine={false}
                  domain={[0, 10]}
                  tickFormatter={(v) => `${v}h`}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(99,102,241,0.06)" }} />
                <Bar dataKey="hours" radius={[6, 6, 0, 0]}>
                  {weekData.map((d, i) => (
                    <Cell
                      key={i}
                      fill={STATUS_COLORS[d.status] ?? STATUS_COLORS.NO_DATA}
                      style={{
                        transition: `opacity 0.3s ease ${i * 60}ms`,
                        opacity: visible ? 1 : 0,
                      }}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Day summary table */}
          <div className="mt-4 divide-y divide-zinc-100 dark:divide-zinc-800">
            {weekData.map((d, i) => {
              if (d.status === "WEEKEND") return null;
              const fmt = (iso: string | null) =>
                iso
                  ? new Date(iso).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true })
                  : "—";
              const statusLabel: Record<string, string> = {
                PRESENT: "Present", HALF_DAY: "Half Day", ABSENT: "Absent", LEAVE: "On Leave", NO_DATA: "—",
              };
              return (
                <div
                  key={d.date}
                  className="flex items-center justify-between py-2.5 text-sm transition-all duration-300"
                  style={{
                    opacity: visible ? 1 : 0,
                    transform: visible ? "translateY(0)" : "translateY(8px)",
                    transitionDelay: `${i * 50}ms`,
                  }}
                >
                  <span className="w-10 font-medium text-zinc-600 dark:text-zinc-300">{d.name}</span>
                  <span className="text-xs text-zinc-400">{d.date}</span>
                  <span
                    className="rounded-full px-2.5 py-0.5 text-xs font-semibold"
                    style={{
                      background: STATUS_COLORS[d.status] + "22",
                      color: STATUS_COLORS[d.status],
                    }}
                  >
                    {statusLabel[d.status]}
                  </span>
                  <span className="text-xs text-zinc-500">{fmt(d.checkIn)} → {fmt(d.checkOut)}</span>
                  <span className="w-12 text-right text-xs font-medium text-zinc-500">
                    {d.hours > 0 ? `${d.hours}h` : "—"}
                  </span>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

"use client";

type StatusType = "PRESENT" | "ABSENT" | "HALF_DAY" | "LEAVE" | null;

type Props = {
  status: StatusType;
  checkIn: string | null;
  checkOut: string | null;
  date?: string;
};

const STATUS_CONFIG: Record<
  NonNullable<StatusType>,
  { label: string; bg: string; text: string; dot: string; icon: string }
> = {
  PRESENT: {
    label: "Present",
    bg: "bg-emerald-50 dark:bg-emerald-950/30",
    text: "text-emerald-700 dark:text-emerald-400",
    dot: "bg-emerald-500",
    icon: "✓",
  },
  ABSENT: {
    label: "Absent",
    bg: "bg-red-50 dark:bg-red-950/30",
    text: "text-red-600 dark:text-red-400",
    dot: "bg-red-500",
    icon: "✕",
  },
  HALF_DAY: {
    label: "Half Day",
    bg: "bg-amber-50 dark:bg-amber-950/30",
    text: "text-amber-700 dark:text-amber-400",
    dot: "bg-amber-500",
    icon: "½",
  },
  LEAVE: {
    label: "On Leave",
    bg: "bg-blue-50 dark:bg-blue-950/30",
    text: "text-blue-700 dark:text-blue-400",
    dot: "bg-blue-500",
    icon: "✈",
  },
};

const NOT_MARKED = {
  label: "Not Marked",
  bg: "bg-zinc-50 dark:bg-zinc-800",
  text: "text-zinc-500 dark:text-zinc-400",
  dot: "bg-zinc-400",
  icon: "–",
};

function fmtTime(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

function calcDuration(checkIn: string | null, checkOut: string | null) {
  if (!checkIn || !checkOut) return null;
  const ms = new Date(checkOut).getTime() - new Date(checkIn).getTime();
  const h = Math.floor(ms / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  return `${h}h ${m}m`;
}

export default function DailyStatus({ status, checkIn, checkOut, date }: Props) {
  const cfg = status ? STATUS_CONFIG[status] : NOT_MARKED;
  const duration = calcDuration(checkIn, checkOut);

  const displayDate = date
    ? new Date(date).toLocaleDateString("en-IN", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : new Date().toLocaleDateString("en-IN", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      });

  return (
    <div
      className="animate-fade-in rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
      id="daily-status-card"
    >
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-400">
            Today&apos;s Status
          </h2>
          <p className="mt-0.5 text-sm text-zinc-500 dark:text-zinc-400">{displayDate}</p>
        </div>

        {/* Badge */}
        <span
          className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-semibold ${cfg.bg} ${cfg.text}`}
          id="daily-status-badge"
          role="status"
          aria-label={`Attendance status: ${cfg.label}`}
        >
          <span className={`h-2 w-2 rounded-full ${cfg.dot}`} />
          {cfg.label}
        </span>
      </div>

      {/* Detail row */}
      <div className="grid grid-cols-3 gap-3">
        <Detail label="Check In" value={fmtTime(checkIn)} />
        <Detail label="Check Out" value={fmtTime(checkOut)} />
        <Detail label="Duration" value={duration ?? "—"} />
      </div>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fade-in 0.4s ease-out both; }
      `}</style>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-zinc-50 px-3 py-2.5 dark:bg-zinc-800">
      <p className="text-xs font-medium uppercase tracking-wider text-zinc-400">{label}</p>
      <p className="mt-1 text-sm font-semibold text-zinc-700 dark:text-zinc-200 tabular-nums">{value}</p>
    </div>
  );
}

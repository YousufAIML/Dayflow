"use client";

import { useEffect, useRef, useState, useCallback } from "react";

type CheckInState = {
  status: "idle" | "loading" | "success" | "error";
  checkIn: string | null;
  checkOut: string | null;
  attendanceStatus: string | null;
  error: string | null;
};

type ButtonAnim = "idle" | "pulse" | "morph";

export default function CheckInCard() {
  const [time, setTime] = useState<string>("");
  const [date, setDate] = useState<string>("");
  const [state, setState] = useState<CheckInState>({
    status: "idle",
    checkIn: null,
    checkOut: null,
    attendanceStatus: null,
    error: null,
  });
  const [btnAnim, setBtnAnim] = useState<ButtonAnim>("idle");
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Live clock
  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        })
      );
      setDate(
        now.toLocaleDateString("en-IN", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      );
    };
    tick();
    timerRef.current = setInterval(tick, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Fetch today's attendance on mount
  useEffect(() => {
    fetch("/api/attendance/today")
      .then((r) => r.json())
      .then((data) => {
        if (data.record) {
          setState((s) => ({
            ...s,
            checkIn: data.record.checkIn,
            checkOut: data.record.checkOut,
            attendanceStatus: data.record.status,
          }));
        }
      })
      .catch(() => {});
  }, []);

  const isCheckedIn = Boolean(state.checkIn);
  const isCheckedOut = Boolean(state.checkOut);

  const handleAction = useCallback(async () => {
    if (state.status === "loading") return;
    setState((s) => ({ ...s, status: "loading", error: null }));
    setBtnAnim("morph");

    const endpoint = isCheckedIn && !isCheckedOut ? "/api/attendance/checkout" : "/api/attendance/checkin";

    try {
      const res = await fetch(endpoint, { method: "POST" });
      const data = await res.json();

      if (!res.ok) {
        setState((s) => ({ ...s, status: "error", error: data.error }));
        setBtnAnim("idle");
        return;
      }

      setState((s) => ({
        ...s,
        status: "success",
        checkIn: data.checkIn ?? s.checkIn,
        checkOut: data.checkOut ?? null,
        attendanceStatus: data.status,
        error: null,
      }));
      setBtnAnim("pulse");
      setTimeout(() => setBtnAnim("idle"), 1500);
    } catch {
      setState((s) => ({ ...s, status: "error", error: "Network error. Please retry." }));
      setBtnAnim("idle");
    }
  }, [isCheckedIn, isCheckedOut, state.status]);

  const fmtTime = (iso: string | null) => {
    if (!iso) return "—";
    return new Date(iso).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const buttonLabel = isCheckedOut
    ? "Day Complete ✓"
    : isCheckedIn
    ? "Check Out"
    : "Check In";

  const buttonDisabled = isCheckedOut || state.status === "loading";

  return (
    <div className="relative overflow-hidden rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      {/* Decorative gradient blob */}
      <div
        className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full opacity-20 blur-3xl"
        style={{ background: "radial-gradient(circle, #6366f1, #8b5cf6)" }}
      />

      {/* Live Clock */}
      <div className="mb-6 text-center">
        <p
          className="font-mono text-5xl font-bold tracking-tight tabular-nums text-zinc-900 dark:text-zinc-50"
          id="live-clock"
          aria-live="polite"
          aria-label={`Current time: ${time}`}
        >
          {time || "—"}
        </p>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">{date}</p>
      </div>

      {/* Check-in / Check-out times row */}
      <div className="mb-6 grid grid-cols-2 gap-4">
        <Stat label="Check In" value={fmtTime(state.checkIn)} color="text-emerald-600 dark:text-emerald-400" />
        <Stat label="Check Out" value={fmtTime(state.checkOut)} color="text-rose-500 dark:text-rose-400" />
      </div>

      {/* Action button */}
      <button
        id="attendance-action-btn"
        onClick={handleAction}
        disabled={buttonDisabled}
        aria-label={buttonLabel}
        className={[
          "relative w-full rounded-xl py-4 text-base font-semibold tracking-wide text-white transition-all duration-300",
          "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2",
          isCheckedOut
            ? "cursor-default bg-zinc-400 dark:bg-zinc-600"
            : isCheckedIn
            ? "bg-rose-500 hover:bg-rose-600 focus-visible:outline-rose-500"
            : "bg-indigo-600 hover:bg-indigo-700 focus-visible:outline-indigo-600",
          btnAnim === "morph" ? "scale-95 opacity-80" : "scale-100 opacity-100",
          btnAnim === "pulse" ? "animate-checkin-pulse" : "",
        ].join(" ")}
      >
        <span className={`transition-all duration-300 ${state.status === "loading" ? "opacity-0" : "opacity-100"}`}>
          {buttonLabel}
        </span>
        {state.status === "loading" && (
          <span className="absolute inset-0 flex items-center justify-center">
            <svg className="h-5 w-5 animate-spin text-white" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
          </span>
        )}
        {btnAnim === "pulse" && (
          <span className="absolute inset-0 flex items-center justify-center">
            <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          </span>
        )}
      </button>

      {/* Error message */}
      {state.error && (
        <p
          role="alert"
          className="mt-3 text-center text-sm text-rose-500"
          id="checkin-error"
        >
          {state.error}
        </p>
      )}

      {/* Inline style for the pulse animation */}
      <style>{`
        @keyframes checkin-pulse {
          0%   { transform: scale(1);    box-shadow: 0 0 0 0 rgba(99,102,241,0.7); }
          50%  { transform: scale(1.03); box-shadow: 0 0 0 12px rgba(99,102,241,0); }
          100% { transform: scale(1);    box-shadow: 0 0 0 0 rgba(99,102,241,0); }
        }
        .animate-checkin-pulse { animation: checkin-pulse 0.8s ease-out forwards; }
      `}</style>
    </div>
  );
}

function Stat({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="rounded-xl bg-zinc-50 px-4 py-3 dark:bg-zinc-800">
      <p className="text-xs font-medium uppercase tracking-wider text-zinc-400">{label}</p>
      <p className={`mt-1 text-lg font-semibold tabular-nums ${color}`}>{value}</p>
    </div>
  );
}

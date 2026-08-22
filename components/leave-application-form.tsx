"use client";

import { useState, useEffect, useId } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Calendar, 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  Send, 
  Info, 
  Palmtree, 
  Stethoscope, 
  FileClock,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  RotateCcw
} from "lucide-react";
import Link from "next/link";
import { createLeaveSchema, LeaveType } from "@/lib/validations/leave";

interface LeaveBalances {
  paid: { total: number; used: number; remaining: number };
  sick: { total: number; used: number; remaining: number };
  unpaid: { used: number };
  pendingCount: number;
}

export function LeaveApplicationForm() {
  const [leaveType, setLeaveType] = useState<"PAID" | "SICK" | "UNPAID">("PAID");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [remarks, setRemarks] = useState("");
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [submittedData, setSubmittedData] = useState<{
    id: string;
    type: string;
    startDate: string;
    endDate: string;
    days: number;
    remarks: string | null;
    status: string;
  } | null>(null);

  const [balances, setBalances] = useState<LeaveBalances | null>(null);
  const [isLoadingSummary, setIsLoadingSummary] = useState(true);

  // Set default min date to today's date formatted as YYYY-MM-DD
  const todayStr = new Date().toISOString().split("T")[0];

  // Fetch current user's leave balances on mount
  useEffect(() => {
    async function loadSummary() {
      try {
        const res = await fetch("/api/leaves");
        const json = await res.json();
        if (json.success && json.data?.balances) {
          setBalances(json.data.balances);
        }
      } catch (e) {
        console.error("Failed to load balances:", e);
      } finally {
        setIsLoadingSummary(false);
      }
    }
    loadSummary();
  }, []);

  // Compute number of days between startDate and endDate
  const calculateDays = () => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate + "T00:00:00");
    const end = new Date(endDate + "T00:00:00");
    if (isNaN(start.getTime()) || isNaN(end.getTime()) || end < start) return 0;
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return days;
  };

  const calculatedDays = calculateDays();

  // Validate on the fly
  const validateField = (field: string, value: string) => {
    const updatedErrors = { ...errors };
    const currentStart = field === "startDate" ? value : startDate;
    const currentEnd = field === "endDate" ? value : endDate;

    if (field === "startDate") {
      if (!value) {
        updatedErrors.startDate = "Start date is required.";
      } else if (value < todayStr) {
        updatedErrors.startDate = "Start date cannot be in the past.";
      } else {
        delete updatedErrors.startDate;
      }
    }

    if (field === "endDate" || field === "startDate") {
      if (currentEnd && currentStart) {
        if (currentEnd < currentStart) {
          updatedErrors.endDate = "End date must be on or after start date.";
        } else {
          delete updatedErrors.endDate;
        }
      }
    }

    setErrors(updatedErrors);
  };

  const quickRemarks = [
    "Annual Family Vacation",
    "Doctor Appointment & Recovery",
    "Attending Wedding Ceremony",
    "Personal & Urgent Work",
    "Home Maintenance",
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    // Validate with Zod
    const result = createLeaveSchema.safeParse({
      type: leaveType,
      startDate,
      endDate,
      remarks,
    });

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const path = issue.path[0] as string;
        if (path) fieldErrors[path] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/leaves", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: leaveType,
          startDate,
          endDate,
          remarks,
        }),
      });

      const json = await response.json();

      if (!response.ok || !json.success) {
        setServerError(json.error || "Failed to submit leave application.");
        if (json.fieldErrors) {
          setErrors(json.fieldErrors);
        }
        return;
      }

      // Success
      setSubmittedData({
        id: json.data.id,
        type: json.data.type,
        startDate,
        endDate,
        days: calculatedDays,
        remarks: json.data.remarks,
        status: json.data.status,
      });

      // Refresh balances
      if (balances) {
        setBalances((prev) => prev ? { ...prev, pendingCount: prev.pendingCount + 1 } : null);
      }
    } catch (err: unknown) {
      setServerError(err instanceof Error ? err.message : "Network error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetForm = () => {
    setSubmittedData(null);
    setStartDate("");
    setEndDate("");
    setRemarks("");
    setErrors({});
    setServerError(null);
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Top Banner / Heading */}
      <div className="mb-8">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              <Palmtree className="h-4 w-4" />
              Employee Portal
            </div>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl dark:text-white">
              Apply for Leave
            </h1>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              Submit your time-off request with automated balance validation and instant HR routing.
            </p>
          </div>
          <Link
            href="/leaves/status"
            className="inline-flex items-center gap-1.5 self-start rounded-lg border border-zinc-300 bg-white px-3.5 py-2 text-xs font-medium text-zinc-700 shadow-xs hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 transition-colors"
          >
            <Clock className="h-3.5 w-3.5 text-zinc-500" />
            View Leave Status & History
            <ArrowRight className="h-3 w-3 text-zinc-400" />
          </Link>
        </div>
      </div>

      {/* Leave Balances Header Cards */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {/* Paid Leave Card */}
        <div className={`relative overflow-hidden rounded-2xl border p-5 transition-all ${
          leaveType === "PAID"
            ? "border-indigo-300 bg-indigo-50/50 shadow-sm dark:border-indigo-800 dark:bg-indigo-950/20"
            : "border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900"
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Paid Leave
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300">
              <Palmtree className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
              {balances ? balances.paid.remaining : "18"}
            </span>
            <span className="text-xs text-zinc-500 dark:text-zinc-400">
              / {balances ? balances.paid.total : "18"} days left
            </span>
          </div>
          <p className="mt-2 text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-medium">
            <CheckCircle2 className="h-3 w-3" /> Fully compensated
          </p>
        </div>

        {/* Sick Leave Card */}
        <div className={`relative overflow-hidden rounded-2xl border p-5 transition-all ${
          leaveType === "SICK"
            ? "border-rose-300 bg-rose-50/50 shadow-sm dark:border-rose-800 dark:bg-rose-950/20"
            : "border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900"
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Sick Leave
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-rose-100 text-rose-700 dark:bg-rose-900/50 dark:text-rose-300">
              <Stethoscope className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
              {balances ? balances.sick.remaining : "10"}
            </span>
            <span className="text-xs text-zinc-500 dark:text-zinc-400">
              / {balances ? balances.sick.total : "10"} days left
            </span>
          </div>
          <p className="mt-2 text-xs text-rose-600 dark:text-rose-400 flex items-center gap-1 font-medium">
            <Info className="h-3 w-3" /> For health & recovery
          </p>
        </div>

        {/* Unpaid Leave Card */}
        <div className={`relative overflow-hidden rounded-2xl border p-5 transition-all ${
          leaveType === "UNPAID"
            ? "border-amber-300 bg-amber-50/50 shadow-sm dark:border-amber-800 dark:bg-amber-950/20"
            : "border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900"
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Unpaid Leave
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300">
              <FileClock className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
              {balances ? balances.unpaid.used : "0"}
            </span>
            <span className="text-xs text-zinc-500 dark:text-zinc-400">days taken this year</span>
          </div>
          <p className="mt-2 text-xs text-amber-600 dark:text-amber-400 flex items-center gap-1 font-medium">
            <AlertCircle className="h-3 w-3" /> Loss of Pay applied
          </p>
        </div>
      </div>

      {/* Main Form or Success View */}
      <AnimatePresence mode="wait">
        {submittedData ? (
          <motion.div
            key="success-card"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            className="rounded-3xl border border-emerald-200 bg-white p-6 shadow-xl shadow-emerald-500/5 sm:p-8 dark:border-emerald-900/40 dark:bg-zinc-900"
          >
            <div className="mx-auto max-w-lg text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <h2 className="mt-4 text-2xl font-bold text-zinc-900 dark:text-white">
                Leave Request Submitted!
              </h2>
              <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                Your request has been routed to HR for review. You can track status updates in real-time.
              </p>

              {/* Request Details Breakdown */}
              <div className="mt-6 rounded-2xl border border-zinc-100 bg-zinc-50/80 p-5 text-left dark:border-zinc-800 dark:bg-zinc-950/60">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-xs text-zinc-400">Leave Type</span>
                    <p className="font-semibold text-zinc-800 dark:text-zinc-200">
                      {submittedData.type} Leave
                    </p>
                  </div>
                  <div>
                    <span className="text-xs text-zinc-400">Duration</span>
                    <p className="font-semibold text-zinc-800 dark:text-zinc-200">
                      {submittedData.days} Day{submittedData.days > 1 ? "s" : ""}
                    </p>
                  </div>
                  <div>
                    <span className="text-xs text-zinc-400">Start Date</span>
                    <p className="font-medium text-zinc-800 dark:text-zinc-200">
                      {submittedData.startDate}
                    </p>
                  </div>
                  <div>
                    <span className="text-xs text-zinc-400">End Date</span>
                    <p className="font-medium text-zinc-800 dark:text-zinc-200">
                      {submittedData.endDate}
                    </p>
                  </div>
                  {submittedData.remarks && (
                    <div className="col-span-2 border-t border-zinc-200/60 pt-3 dark:border-zinc-800">
                      <span className="text-xs text-zinc-400">Remarks</span>
                      <p className="mt-0.5 text-xs text-zinc-700 dark:text-zinc-300">
                        {submittedData.remarks}
                      </p>
                    </div>
                  )}
                  <div className="col-span-2 border-t border-zinc-200/60 pt-3 dark:border-zinc-800 flex items-center justify-between">
                    <span className="text-xs text-zinc-400">Current Status</span>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-800 dark:bg-amber-950/60 dark:text-amber-300">
                      <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
                      Pending Approval
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
                <button
                  type="button"
                  onClick={handleResetForm}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-zinc-300 bg-white px-5 py-2.5 text-sm font-medium text-zinc-700 shadow-xs hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700 transition-colors"
                >
                  <RotateCcw className="h-4 w-4" />
                  Submit Another Request
                </button>
                <Link
                  href="/leaves/status"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-zinc-900 px-5 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100 transition-all"
                >
                  Go to My Leaves
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="leave-form"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8 dark:border-zinc-800 dark:bg-zinc-900"
          >
            <form onSubmit={handleSubmit} className="space-y-6" noValidate>
              {/* Server Error / Overlap Banner */}
              {serverError && (
                <div className="flex items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50/90 p-4 dark:border-rose-900/50 dark:bg-rose-950/40">
                  <ShieldAlert className="h-5 w-5 shrink-0 text-rose-600 dark:text-rose-400 mt-0.5" />
                  <div className="text-sm text-rose-800 dark:text-rose-200">
                    <p className="font-semibold">Unable to submit request</p>
                    <p className="mt-0.5 text-xs text-rose-700 dark:text-rose-300">{serverError}</p>
                  </div>
                </div>
              )}

              {/* 1. Leave Type Segmented Control */}
              <div>
                <label className="block text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
                  1. Select Leave Type <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  {[
                    {
                      id: "PAID",
                      title: "Paid Leave",
                      desc: "Vacation / Casual leave",
                      icon: Palmtree,
                      color: "indigo",
                    },
                    {
                      id: "SICK",
                      title: "Sick Leave",
                      desc: "Medical recovery",
                      icon: Stethoscope,
                      color: "rose",
                    },
                    {
                      id: "UNPAID",
                      title: "Unpaid Leave",
                      desc: "Loss of pay",
                      icon: FileClock,
                      color: "amber",
                    },
                  ].map((option) => {
                    const isSelected = leaveType === option.id;
                    const Icon = option.icon;
                    return (
                      <button
                        type="button"
                        key={option.id}
                        onClick={() => setLeaveType(option.id as "PAID" | "SICK" | "UNPAID")}
                        className={`relative flex items-start gap-3 rounded-2xl border p-4 text-left transition-all ${
                          isSelected
                            ? "border-zinc-900 bg-zinc-900 text-white shadow-md dark:border-white dark:bg-white dark:text-zinc-900"
                            : "border-zinc-200 bg-zinc-50/50 text-zinc-800 hover:border-zinc-300 hover:bg-zinc-100/70 dark:border-zinc-800 dark:bg-zinc-950/40 dark:text-zinc-200 dark:hover:border-zinc-700"
                        }`}
                      >
                        <div className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${
                          isSelected
                            ? "bg-white/20 text-white dark:bg-black/10 dark:text-zinc-900"
                            : "bg-zinc-200/80 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
                        }`}>
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-sm">{option.title}</span>
                            {isSelected && (
                              <CheckCircle2 className="h-4 w-4 text-emerald-400 dark:text-emerald-600" />
                            )}
                          </div>
                          <p className={`mt-0.5 text-xs ${
                            isSelected ? "text-zinc-300 dark:text-zinc-600" : "text-zinc-500 dark:text-zinc-400"
                          }`}>
                            {option.desc}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
                {errors.type && (
                  <p className="mt-1.5 flex items-center gap-1 text-xs text-rose-600 dark:text-rose-400">
                    <AlertCircle className="h-3.5 w-3.5" />
                    {errors.type}
                  </p>
                )}
              </div>

              {/* 2. Date Range Picker */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                    2. Select Date Range <span className="text-rose-500">*</span>
                  </label>
                  {calculatedDays > 0 && (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-100 px-3 py-0.5 text-xs font-semibold text-indigo-800 dark:bg-indigo-950/60 dark:text-indigo-300">
                      <Clock className="h-3 w-3" />
                      Duration: {calculatedDays} {calculatedDays === 1 ? "Day" : "Days"}
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {/* Start Date */}
                  <div>
                    <label htmlFor="startDate" className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1">
                      From (Start Date)
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        id="startDate"
                        name="startDate"
                        min={todayStr}
                        value={startDate}
                        onChange={(e) => {
                          setStartDate(e.target.value);
                          validateField("startDate", e.target.value);
                        }}
                        className={`w-full rounded-xl border bg-white px-4 py-2.5 text-sm text-zinc-900 shadow-xs transition-colors focus:outline-hidden dark:bg-zinc-950 dark:text-white ${
                          errors.startDate
                            ? "border-rose-400 focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
                            : "border-zinc-300 focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 dark:border-zinc-700 dark:focus:border-white"
                        }`}
                      />
                    </div>
                    {errors.startDate && (
                      <p className="mt-1.5 flex items-center gap-1 text-xs text-rose-600 dark:text-rose-400">
                        <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                        {errors.startDate}
                      </p>
                    )}
                  </div>

                  {/* End Date */}
                  <div>
                    <label htmlFor="endDate" className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1">
                      To (End Date)
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        id="endDate"
                        name="endDate"
                        min={startDate || todayStr}
                        value={endDate}
                        onChange={(e) => {
                          setEndDate(e.target.value);
                          validateField("endDate", e.target.value);
                        }}
                        className={`w-full rounded-xl border bg-white px-4 py-2.5 text-sm text-zinc-900 shadow-xs transition-colors focus:outline-hidden dark:bg-zinc-950 dark:text-white ${
                          errors.endDate
                            ? "border-rose-400 focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
                            : "border-zinc-300 focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 dark:border-zinc-700 dark:focus:border-white"
                        }`}
                      />
                    </div>
                    {errors.endDate && (
                      <p className="mt-1.5 flex items-center gap-1 text-xs text-rose-600 dark:text-rose-400">
                        <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                        {errors.endDate}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* 3. Remarks / Reason with Suggestions */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label htmlFor="remarks" className="block text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                    3. Remarks & Purpose <span className="text-xs font-normal text-zinc-400">(Optional)</span>
                  </label>
                  <span className={`text-xs ${remarks.length > 450 ? "text-amber-600 font-semibold" : "text-zinc-400"}`}>
                    {remarks.length}/500
                  </span>
                </div>

                {/* Quick Suggestion Pills */}
                <div className="mb-2.5 flex flex-wrap items-center gap-1.5">
                  <span className="text-[11px] font-medium text-zinc-400 mr-1 flex items-center gap-1">
                    <Sparkles className="h-3 w-3 text-indigo-500" /> Quick tags:
                  </span>
                  {quickRemarks.map((tag) => (
                    <button
                      type="button"
                      key={tag}
                      onClick={() => setRemarks(tag)}
                      className="rounded-lg border border-zinc-200 bg-zinc-50 px-2.5 py-1 text-xs text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-200 transition-colors"
                    >
                      {tag}
                    </button>
                  ))}
                </div>

                <textarea
                  id="remarks"
                  name="remarks"
                  rows={3}
                  maxLength={500}
                  placeholder="Provide context or instructions for handoff while on leave..."
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  className={`w-full rounded-2xl border bg-white p-3.5 text-sm text-zinc-900 shadow-xs transition-colors focus:outline-hidden dark:bg-zinc-950 dark:text-white ${
                    errors.remarks
                      ? "border-rose-400 focus:border-rose-500"
                      : "border-zinc-300 focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 dark:border-zinc-700 dark:focus:border-white"
                  }`}
                />
                {errors.remarks && (
                  <p className="mt-1.5 flex items-center gap-1 text-xs text-rose-600 dark:text-rose-400">
                    <AlertCircle className="h-3.5 w-3.5" />
                    {errors.remarks}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="relative flex w-full items-center justify-center gap-2 rounded-2xl bg-zinc-900 py-3.5 text-sm font-semibold text-white shadow-lg shadow-zinc-950/10 hover:bg-zinc-800 disabled:opacity-60 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100 transition-all cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      <span>Validating & Submitting Request...</span>
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      <span>Submit Leave Application</span>
                    </>
                  )}
                </button>
                <p className="mt-2 text-center text-xs text-zinc-400 dark:text-zinc-500">
                  Requests are instantly recorded in the database and sent to HR for approval.
                </p>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

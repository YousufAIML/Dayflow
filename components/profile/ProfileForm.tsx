"use client";

import { useState, useRef } from "react";
import { useSession } from "next-auth/react";

interface ProfileData {
  id: string;
  employeeId: string;
  fullName: string | null;
  email: string;
  phone: string | null;
  address: string | null;
  profilePic: string | null;
  jobTitle: string | null;
  department: string | null;
  role: string;
  dateJoined: string;
  updatedAt: string;
  payroll?: {
    baseSalary: number;
    allowances: number;
    deductions: number;
  } | null;
}

interface ProfileFormProps {
  initialData: ProfileData;
  /** If provided, admin editing a specific employee's profile */
  targetUserId?: string;
  isAdminView?: boolean;
}

type SaveState = "idle" | "saving" | "saved" | "error";

function SaveIcon() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12" /></svg>;
}
function SpinnerIcon() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true" className="animate-spin-slow"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" /></svg>;
}
function ErrorIcon() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>;
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{ marginBottom: "2rem" }}>
      <h2
        style={{
          fontSize: "0.75rem",
          fontWeight: 600,
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          color: "var(--color-text-muted)",
          marginBottom: "1rem",
          marginTop: 0,
          paddingBottom: "0.5rem",
          borderBottom: "1px solid var(--color-border)",
        }}
      >
        {title}
      </h2>
      {children}
    </section>
  );
}

function FieldRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "180px 1fr",
        gap: "1rem",
        alignItems: "start",
        marginBottom: "1rem",
      }}
      className="field-row"
    >
      <div className="label" style={{ paddingTop: "0.625rem" }}>{label}</div>
      <div>{children}</div>
      <style>{`
        @media (max-width: 600px) {
          .field-row { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}

function ReadonlyValue({ value }: { value: string | null | undefined }) {
  return (
    <div
      style={{
        padding: "0.625rem 0.875rem",
        background: "var(--color-surface-elevated)",
        border: "1px solid var(--color-border)",
        borderRadius: "var(--radius-md)",
        fontSize: "0.875rem",
        color: value ? "var(--color-text-primary)" : "var(--color-text-muted)",
        minHeight: "2.5rem",
      }}
    >
      {value ?? "—"}
    </div>
  );
}

function Avatar({ src, name, size = 80 }: { src?: string | null; name?: string | null; size?: number }) {
  const initials = (name ?? "?")
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return src ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={name ?? "Profile"}
      style={{ width: size, height: size, borderRadius: "50%", objectFit: "cover", border: "2px solid var(--color-border)" }}
    />
  ) : (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: "color-mix(in srgb, var(--color-primary-500) 18%, transparent)",
        color: "var(--color-primary-600)",
        fontWeight: 700,
        fontSize: size * 0.35,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        border: "2px solid var(--color-border)",
      }}
    >
      {initials}
    </div>
  );
}

export default function ProfileForm({ initialData, targetUserId, isAdminView = false }: ProfileFormProps) {
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === "ADMIN";
  const canEditAll = isAdmin; // Admin can edit all fields

  const [form, setForm] = useState({
    fullName: initialData.fullName ?? "",
    phone: initialData.phone ?? "",
    address: initialData.address ?? "",
    profilePic: initialData.profilePic ?? "",
    jobTitle: initialData.jobTitle ?? "",
    department: initialData.department ?? "",
    role: initialData.role,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [saveError, setSaveError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
    setSaveState("idle");
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 1.5 * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, profilePic: "Image must be under 1.5 MB" }));
      return;
    }

    const reader = new FileReader();
    reader.onload = (ev) => {
      setForm((prev) => ({ ...prev, profilePic: ev.target?.result as string }));
      setSaveState("idle");
    };
    reader.readAsDataURL(file);
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (canEditAll && !form.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }
    if (form.phone && !/^[+\d\s\-()]{7,20}$/.test(form.phone)) {
      newErrors.phone = "Enter a valid phone number";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setSaveState("saving");
    setSaveError("");

    const payload: Record<string, unknown> = {
      phone: form.phone || null,
      address: form.address || null,
      profilePic: form.profilePic || null,
    };

    if (canEditAll) {
      payload.fullName = form.fullName || null;
      payload.jobTitle = form.jobTitle || null;
      payload.department = form.department || null;
      if (isAdminView) payload.role = form.role;
    }

    const url = isAdminView && targetUserId
      ? `/api/admin/employees/${targetUserId}`
      : "/api/profile";

    try {
      const res = await fetch(url, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        setSaveError(data.error ?? "Failed to save changes.");
        setSaveState("error");
        return;
      }

      setSaveState("saved");
      setTimeout(() => setSaveState("idle"), 3000);
    } catch {
      setSaveError("Network error. Please check your connection.");
      setSaveState("error");
    }
  };

  const getSaveButtonContent = () => {
    switch (saveState) {
      case "saving":
        return <><SpinnerIcon /> Saving…</>;
      case "saved":
        return <><SaveIcon /> Saved!</>;
      case "error":
        return <><ErrorIcon /> Save failed</>;
      default:
        return "Save Changes";
    }
  };

  const getSaveButtonStyle = (): React.CSSProperties => {
    const base: React.CSSProperties = {
      display: "inline-flex",
      alignItems: "center",
      gap: "0.375rem",
      padding: "0.625rem 1.25rem",
      borderRadius: "var(--radius-md)",
      fontSize: "0.875rem",
      fontWeight: 500,
      border: "none",
      cursor: saveState === "saving" ? "wait" : "pointer",
      transition: "all var(--transition-base)",
    };

    switch (saveState) {
      case "saved":
        return { ...base, background: "var(--color-success-500)", color: "#fff" };
      case "error":
        return { ...base, background: "var(--color-error-500)", color: "#fff" };
      default:
        return { ...base, background: "var(--color-primary-600)", color: "#fff" };
    }
  };

  return (
    <div style={{ padding: "2rem", maxWidth: 800, margin: "0 auto" }}>
      {/* ── Header ── */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: "2rem",
          gap: "1rem",
          flexWrap: "wrap",
        }}
      >
        <div>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 700, margin: 0, color: "var(--color-text-primary)" }}>
            {isAdminView ? `${initialData.fullName ?? "Employee"}'s Profile` : "My Profile"}
          </h1>
          <p style={{ margin: "0.375rem 0 0", color: "var(--color-text-muted)", fontSize: "0.875rem" }}>
            {isAdminView && isAdmin
              ? "You are editing this profile as an administrator."
              : "You can edit your contact details and profile picture."}
          </p>
        </div>

        {/* Save button */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "0.375rem" }}>
          <button
            id="profile-save-btn"
            onClick={handleSave}
            disabled={saveState === "saving"}
            style={getSaveButtonStyle()}
          >
            {getSaveButtonContent()}
          </button>
          {saveState === "error" && saveError && (
            <p style={{ fontSize: "0.75rem", color: "var(--color-error-500)", margin: 0 }}>{saveError}</p>
          )}
        </div>
      </div>

      {/* ── Profile Picture ── */}
      <Section title="Profile Picture">
        <div style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}>
          <Avatar src={form.profilePic} name={form.fullName || initialData.fullName} size={80} />
          <div>
            <button
              id="profile-pic-upload-btn"
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="btn-ghost"
              style={{ fontSize: "0.8125rem" }}
            >
              Upload Photo
            </button>
            <p style={{ fontSize: "0.75rem", color: "var(--color-text-muted)", margin: "0.375rem 0 0" }}>
              JPG, PNG, WebP — max 1.5 MB
            </p>
            {errors.profilePic && <p className="field-error" role="alert">{errors.profilePic}</p>}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            style={{ display: "none" }}
            onChange={handleImageChange}
          />
        </div>
      </Section>

      {/* ── Personal Information ── */}
      <Section title="Personal Information">
        <FieldRow label="Full Name">
          {canEditAll ? (
            <>
              <input
                id="profile-fullName"
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                className={`input${errors.fullName ? " error" : ""}`}
                placeholder="Full name"
              />
              {errors.fullName && <p className="field-error" role="alert">{errors.fullName}</p>}
            </>
          ) : (
            <ReadonlyValue value={initialData.fullName} />
          )}
        </FieldRow>

        <FieldRow label="Employee ID">
          <ReadonlyValue value={initialData.employeeId} />
        </FieldRow>

        <FieldRow label="Email">
          <ReadonlyValue value={initialData.email} />
        </FieldRow>

        <FieldRow label="Phone">
          <input
            id="profile-phone"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            className={`input${errors.phone ? " error" : ""}`}
            placeholder="+91 98765 43210"
          />
          {errors.phone && <p className="field-error" role="alert">{errors.phone}</p>}
        </FieldRow>

        <FieldRow label="Address">
          <textarea
            id="profile-address"
            name="address"
            value={form.address}
            onChange={handleChange}
            className="input"
            placeholder="Your home address"
            rows={3}
            style={{ resize: "vertical" }}
          />
        </FieldRow>
      </Section>

      {/* ── Job Details ── */}
      <Section title="Job Details">
        <FieldRow label="Job Title">
          {canEditAll ? (
            <input
              id="profile-jobTitle"
              name="jobTitle"
              value={form.jobTitle}
              onChange={handleChange}
              className="input"
              placeholder="e.g. Software Engineer"
            />
          ) : (
            <ReadonlyValue value={initialData.jobTitle} />
          )}
        </FieldRow>

        <FieldRow label="Department">
          {canEditAll ? (
            <input
              id="profile-department"
              name="department"
              value={form.department}
              onChange={handleChange}
              className="input"
              placeholder="e.g. Engineering"
            />
          ) : (
            <ReadonlyValue value={initialData.department} />
          )}
        </FieldRow>

        <FieldRow label="Role">
          {isAdminView && isAdmin ? (
            <select
              id="profile-role"
              name="role"
              value={form.role}
              onChange={handleChange}
              className="input"
              style={{ cursor: "pointer" }}
            >
              <option value="EMPLOYEE">Employee</option>
              <option value="ADMIN">HR / Admin</option>
            </select>
          ) : (
            <div style={{ display: "flex" }}>
              <span className={`badge ${initialData.role === "ADMIN" ? "badge-primary" : "badge-neutral"}`}>
                {initialData.role === "ADMIN" ? "Administrator" : "Employee"}
              </span>
            </div>
          )}
        </FieldRow>

        <FieldRow label="Date Joined">
          <ReadonlyValue
            value={new Date(initialData.dateJoined).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          />
        </FieldRow>
      </Section>

      {/* ── Salary (read-only for employee) ── */}
      <Section title="Salary & Compensation">
        {initialData.payroll ? (
          <>
            <FieldRow label="Base Salary">
              <ReadonlyValue
                value={`₹${initialData.payroll.baseSalary.toLocaleString("en-IN")}`}
              />
            </FieldRow>
            <FieldRow label="Allowances">
              <ReadonlyValue
                value={`₹${initialData.payroll.allowances.toLocaleString("en-IN")}`}
              />
            </FieldRow>
            <FieldRow label="Deductions">
              <ReadonlyValue
                value={`₹${initialData.payroll.deductions.toLocaleString("en-IN")}`}
              />
            </FieldRow>
            <FieldRow label="Net Pay">
              <ReadonlyValue
                value={`₹${(
                  initialData.payroll.baseSalary +
                  initialData.payroll.allowances -
                  initialData.payroll.deductions
                ).toLocaleString("en-IN")}`}
              />
            </FieldRow>
          </>
        ) : (
          <p style={{ fontSize: "0.875rem", color: "var(--color-text-muted)", margin: 0 }}>
            No salary information on record yet.
          </p>
        )}
      </Section>

      {/* ── Save bar (sticky bottom on mobile) ── */}
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          paddingTop: "1rem",
          borderTop: "1px solid var(--color-border)",
        }}
      >
        <button
          id="profile-save-bottom-btn"
          onClick={handleSave}
          disabled={saveState === "saving"}
          style={getSaveButtonStyle()}
        >
          {getSaveButtonContent()}
        </button>
      </div>
    </div>
  );
}

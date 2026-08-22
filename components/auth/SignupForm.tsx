"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Logo from "@/components/Logo";

/* ── Types ── */
interface FormData {
  employeeId: string;
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: "EMPLOYEE" | "ADMIN";
}
interface FieldErrors {
  employeeId?: string;
  fullName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  role?: string;
}

/* ── Password strength ── */
function getPasswordStrength(password: string): { score: number; label: string; color: string } {
  if (!password) return { score: 0, label: "", color: "var(--color-border)" };
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 1) return { score, label: "Very weak", color: "var(--color-error-500)" };
  if (score === 2) return { score, label: "Weak", color: "var(--color-warning-500)" };
  if (score === 3) return { score, label: "Fair", color: "#f59e0b" };
  if (score === 4) return { score, label: "Good", color: "var(--color-accent-500)" };
  return { score, label: "Strong", color: "var(--color-success-500)" };
}

/* ── Client-side validation ── */
function validateField(name: keyof FormData, value: string, formData: FormData): string {
  switch (name) {
    case "employeeId":
      if (!value) return "Employee ID is required";
      if (value.length < 3) return "At least 3 characters";
      if (!/^[A-Za-z0-9_-]+$/.test(value)) return "Letters, numbers, - and _ only";
      return "";
    case "fullName":
      if (!value) return "Full name is required";
      if (value.length < 2) return "At least 2 characters";
      return "";
    case "email":
      if (!value) return "Email is required";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Enter a valid email";
      return "";
    case "password":
      if (!value) return "Password is required";
      if (value.length < 8) return "At least 8 characters";
      if (!/[A-Z]/.test(value)) return "Include at least one uppercase letter";
      if (!/[0-9]/.test(value)) return "Include at least one number";
      return "";
    case "confirmPassword":
      if (!value) return "Please confirm your password";
      if (value !== formData.password) return "Passwords do not match";
      return "";
    default:
      return "";
  }
}

/* ── Eye icon ── */
function EyeIcon({ open }: { open: boolean }) {
  return open ? (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ) : (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );
}

/* ── Spinner ── */
function Spinner() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true" className="animate-spin-slow">
      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
    </svg>
  );
}

/* ── Main form ── */
export default function SignupForm() {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    employeeId: "",
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "EMPLOYEE",
  });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [touched, setTouched] = useState<Partial<Record<keyof FormData, boolean>>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  const strength = getPasswordStrength(formData.password);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      const updated = { ...formData, [name]: value };
      setFormData(updated);
      if (touched[name as keyof FormData]) {
        setErrors((prev) => ({
          ...prev,
          [name]: validateField(name as keyof FormData, value, updated),
        }));
      }
    },
    [formData, touched]
  );

  const handleBlur = useCallback(
    (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setTouched((prev) => ({ ...prev, [name]: true }));
      setErrors((prev) => ({
        ...prev,
        [name]: validateField(name as keyof FormData, value, formData),
      }));
    },
    [formData]
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError("");

    // Validate all fields
    const allErrors: FieldErrors = {};
    (Object.keys(formData) as Array<keyof FormData>).forEach((key) => {
      if (key !== "role") {
        const err = validateField(key, formData[key], formData);
        if (err) allErrors[key] = err;
      }
    });

    setTouched({ employeeId: true, fullName: true, email: true, password: true, confirmPassword: true });
    setErrors(allErrors);

    if (Object.values(allErrors).some(Boolean)) return;

    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          employeeId: formData.employeeId,
          fullName: formData.fullName,
          email: formData.email,
          password: formData.password,
          role: formData.role,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.issues) {
          // Map server-side Zod issues back to fields
          const serverFieldErrors: FieldErrors = {};
          Object.entries(data.issues).forEach(([field, msgs]) => {
            serverFieldErrors[field as keyof FieldErrors] = (msgs as string[])[0];
          });
          setErrors(serverFieldErrors);
        } else {
          setServerError(data.error ?? "Something went wrong.");
        }
        return;
      }

      router.push("/signin?registered=true");
    } catch {
      setServerError("Network error. Please check your connection.");
    } finally {
      setIsLoading(false);
    }
  };

  const inputStyle = (field: keyof FieldErrors) => ({
    ...(touched[field] && errors[field] ? { borderColor: "var(--color-error-500)" } : {}),
  });

  return (
    <div
      className="card page-enter"
      style={{ padding: "2.5rem 2rem" }}
    >
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "2rem" }}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "1.25rem" }}>
          <Logo size="lg" />
        </div>
        <h1 style={{ fontSize: "1.375rem", fontWeight: 700, color: "var(--color-text-primary)", margin: 0 }}>
          Create your account
        </h1>
        <p style={{ fontSize: "0.875rem", color: "var(--color-text-muted)", marginTop: "0.375rem" }}>
          Join Dayflow to manage your workday
        </p>
      </div>

      {/* Server error */}
      {serverError && (
        <div
          role="alert"
          style={{
            background: "var(--color-error-50)",
            border: "1px solid var(--color-error-500)",
            borderRadius: "var(--radius-md)",
            padding: "0.75rem 1rem",
            fontSize: "0.875rem",
            color: "var(--color-error-600)",
            marginBottom: "1.5rem",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
          {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>

          {/* Row: Employee ID + Role */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div>
              <label htmlFor="signup-employeeId" className="label">Employee ID</label>
              <input
                id="signup-employeeId"
                name="employeeId"
                type="text"
                autoComplete="username"
                placeholder="EMP001"
                value={formData.employeeId}
                onChange={handleChange}
                onBlur={handleBlur}
                className="input"
                style={inputStyle("employeeId")}
                disabled={isLoading}
              />
              {touched.employeeId && errors.employeeId && (
                <p className="field-error" role="alert">{errors.employeeId}</p>
              )}
            </div>

            <div>
              <label htmlFor="signup-role" className="label">Role</label>
              <select
                id="signup-role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="input"
                disabled={isLoading}
                style={{ cursor: "pointer" }}
              >
                <option value="EMPLOYEE">Employee</option>
                <option value="ADMIN">HR / Admin</option>
              </select>
            </div>
          </div>

          {/* Full Name */}
          <div>
            <label htmlFor="signup-fullName" className="label">Full Name</label>
            <input
              id="signup-fullName"
              name="fullName"
              type="text"
              autoComplete="name"
              placeholder="Priya Sharma"
              value={formData.fullName}
              onChange={handleChange}
              onBlur={handleBlur}
              className="input"
              style={inputStyle("fullName")}
              disabled={isLoading}
            />
            {touched.fullName && errors.fullName && (
              <p className="field-error" role="alert">{errors.fullName}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="signup-email" className="label">Work Email</label>
            <input
              id="signup-email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="priya@company.com"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              className="input"
              style={inputStyle("email")}
              disabled={isLoading}
            />
            {touched.email && errors.email && (
              <p className="field-error" role="alert">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label htmlFor="signup-password" className="label">Password</label>
            <div style={{ position: "relative" }}>
              <input
                id="signup-password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                placeholder="Min 8 chars, 1 uppercase, 1 number"
                value={formData.password}
                onChange={handleChange}
                onBlur={handleBlur}
                className="input"
                style={{ ...inputStyle("password"), paddingRight: "2.75rem" }}
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                style={{
                  position: "absolute",
                  right: "0.75rem",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "var(--color-text-muted)",
                  display: "flex",
                  alignItems: "center",
                  padding: "0.25rem",
                }}
              >
                <EyeIcon open={showPassword} />
              </button>
            </div>

            {/* Password strength meter */}
            {formData.password && (
              <div style={{ marginTop: "0.5rem" }}>
                <div style={{ display: "flex", gap: "0.25rem", marginBottom: "0.25rem" }}>
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      style={{
                        flex: 1,
                        height: 3,
                        borderRadius: 9999,
                        background: i <= strength.score ? strength.color : "var(--color-border)",
                        transition: "background-color 200ms ease-out",
                      }}
                    />
                  ))}
                </div>
                <p style={{ fontSize: "0.75rem", color: strength.color, margin: 0 }}>
                  {strength.label}
                </p>
              </div>
            )}

            {touched.password && errors.password && (
              <p className="field-error" role="alert">{errors.password}</p>
            )}
          </div>

          {/* Confirm password */}
          <div>
            <label htmlFor="signup-confirmPassword" className="label">Confirm Password</label>
            <div style={{ position: "relative" }}>
              <input
                id="signup-confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                autoComplete="new-password"
                placeholder="Repeat your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                onBlur={handleBlur}
                className="input"
                style={{ ...inputStyle("confirmPassword"), paddingRight: "2.75rem" }}
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((v) => !v)}
                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                style={{
                  position: "absolute",
                  right: "0.75rem",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "var(--color-text-muted)",
                  display: "flex",
                  alignItems: "center",
                  padding: "0.25rem",
                }}
              >
                <EyeIcon open={showConfirmPassword} />
              </button>
            </div>
            {touched.confirmPassword && errors.confirmPassword && (
              <p className="field-error" role="alert">{errors.confirmPassword}</p>
            )}
          </div>

          {/* Submit */}
          <button
            id="signup-submit-btn"
            type="submit"
            className="btn-primary"
            disabled={isLoading}
            style={{ marginTop: "0.5rem", width: "100%", padding: "0.75rem" }}
          >
            {isLoading ? (
              <>
                <Spinner />
                Creating account…
              </>
            ) : (
              "Create Account"
            )}
          </button>
        </div>
      </form>

      {/* Divider + signin link */}
      <hr className="divider" />
      <p style={{ textAlign: "center", fontSize: "0.875rem", color: "var(--color-text-muted)", margin: 0 }}>
        Already have an account?{" "}
        <Link
          href="/signin"
          style={{ color: "var(--color-primary-600)", fontWeight: 500, textDecoration: "none" }}
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}

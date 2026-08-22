"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Logo from "@/components/Logo";

/* ── Spinner ── */
function Spinner() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true" className="animate-spin-slow">
      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
    </svg>
  );
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

/* ── Map NextAuth error codes to human messages ── */
function getErrorMessage(error: string | null): string {
  if (!error) return "";
  switch (error) {
    case "CredentialsSignin":
      return "Invalid email or password. Please try again.";
    case "SessionRequired":
      return "Please sign in to access this page.";
    case "OAuthAccountNotLinked":
      return "This email is already linked to another account.";
    default:
      return "An error occurred. Please try again.";
  }
}

export default function SigninForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");
  const registered = searchParams.get("registered") === "true";
  const errorParam = searchParams.get("error");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(getErrorMessage(errorParam));
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const validate = () => {
    let valid = true;
    if (!email) { setEmailError("Email is required"); valid = false; }
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setEmailError("Enter a valid email"); valid = false; }
    else setEmailError("");

    if (!password) { setPasswordError("Password is required"); valid = false; }
    else setPasswordError("");

    return valid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!validate()) return;

    setIsLoading(true);
    try {
      const result = await signIn("credentials", {
        email: email.toLowerCase().trim(),
        password,
        redirect: false,
      });

      if (result?.error) {
        setError(getErrorMessage(result.error));
        return;
      }

      if (result?.ok) {
        // Fetch session to get role for redirect
        const sessionRes = await fetch("/api/auth/session");
        const session = await sessionRes.json();
        const role = session?.user?.role;

        const destination = callbackUrl ?? (role === "ADMIN" ? "/admin" : "/dashboard");
        router.replace(destination);
        router.refresh();
      }
    } catch {
      setError("Network error. Please check your connection.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="card page-enter" style={{ padding: "2.5rem 2rem" }}>
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "2rem" }}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "1.25rem" }}>
          <Logo size="lg" />
        </div>
        <h1 style={{ fontSize: "1.375rem", fontWeight: 700, color: "var(--color-text-primary)", margin: 0 }}>
          Welcome back
        </h1>
        <p style={{ fontSize: "0.875rem", color: "var(--color-text-muted)", marginTop: "0.375rem" }}>
          Sign in to your Dayflow account
        </p>
      </div>

      {/* Success banner after registration */}
      {registered && (
        <div
          role="status"
          style={{
            background: "var(--color-success-50)",
            border: "1px solid var(--color-success-500)",
            borderRadius: "var(--radius-md)",
            padding: "0.75rem 1rem",
            fontSize: "0.875rem",
            color: "var(--color-success-600)",
            marginBottom: "1.5rem",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          Account created successfully! Please sign in.
        </div>
      )}

      {/* Error banner */}
      {error && (
        <div
          id="signin-error-message"
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
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          {/* Email */}
          <div>
            <label htmlFor="signin-email" className="label">Email</label>
            <input
              id="signin-email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="you@company.com"
              value={email}
              onChange={(e) => { setEmail(e.target.value); if (emailError) setEmailError(""); }}
              onBlur={() => {
                if (!email) setEmailError("Email is required");
                else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) setEmailError("Enter a valid email");
                else setEmailError("");
              }}
              className="input"
              style={emailError ? { borderColor: "var(--color-error-500)" } : {}}
              disabled={isLoading}
              autoFocus
            />
            {emailError && <p className="field-error" role="alert">{emailError}</p>}
          </div>

          {/* Password */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "0.375rem" }}>
              <label htmlFor="signin-password" className="label" style={{ margin: 0 }}>Password</label>
              <Link
                href="/forgot-password"
                style={{ fontSize: "0.75rem", color: "var(--color-primary-600)", textDecoration: "none" }}
              >
                Forgot password?
              </Link>
            </div>
            <div style={{ position: "relative" }}>
              <input
                id="signin-password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="Your password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); if (passwordError) setPasswordError(""); }}
                onBlur={() => { if (!password) setPasswordError("Password is required"); else setPasswordError(""); }}
                className="input"
                style={{
                  paddingRight: "2.75rem",
                  ...(passwordError ? { borderColor: "var(--color-error-500)" } : {}),
                }}
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
            {passwordError && <p className="field-error" role="alert">{passwordError}</p>}
          </div>

          {/* Submit */}
          <button
            id="signin-submit-btn"
            type="submit"
            className="btn-primary"
            disabled={isLoading}
            style={{ marginTop: "0.25rem", width: "100%", padding: "0.75rem" }}
          >
            {isLoading ? (
              <>
                <Spinner />
                Signing in…
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </div>
      </form>

      <hr className="divider" />
      <p style={{ textAlign: "center", fontSize: "0.875rem", color: "var(--color-text-muted)", margin: 0 }}>
        New to Dayflow?{" "}
        <Link
          href="/signup"
          style={{ color: "var(--color-primary-600)", fontWeight: 500, textDecoration: "none" }}
        >
          Create an account
        </Link>
      </p>
    </div>
  );
}

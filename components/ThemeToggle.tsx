"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

/** Sun icon */
function SunIcon({ size = 16 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
  );
}

/** Moon icon */
function MoonIcon({ size = 16 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

interface ThemeToggleProps {
  className?: string;
}

/**
 * Animated sun/moon theme toggle.
 * Uses opacity + rotation cross-fade transition (200ms).
 * Persisted by next-themes across sessions.
 */
export default function ThemeToggle({ className = "" }: ThemeToggleProps) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch — only render after mount
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <div
        className={className}
        style={{
          width: 36,
          height: 36,
          borderRadius: "var(--radius-md)",
          background: "var(--color-surface-elevated)",
        }}
      />
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      id="theme-toggle"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={className}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      style={{
        position: "relative",
        width: 36,
        height: 36,
        borderRadius: "var(--radius-md)",
        border: "1px solid var(--color-border)",
        background: "var(--color-surface-elevated)",
        color: "var(--color-text-secondary)",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "background-color var(--transition-base), border-color var(--transition-base), color var(--transition-base)",
        overflow: "hidden",
        flexShrink: 0,
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLButtonElement).style.backgroundColor =
          "var(--color-surface-hover)";
        (e.currentTarget as HTMLButtonElement).style.color =
          "var(--color-text-primary)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLButtonElement).style.backgroundColor =
          "var(--color-surface-elevated)";
        (e.currentTarget as HTMLButtonElement).style.color =
          "var(--color-text-secondary)";
      }}
    >
      {/* Sun — visible in dark mode (click to switch to light) */}
      <span
        style={{
          position: "absolute",
          transition: "opacity 200ms ease-out, transform 200ms ease-out",
          opacity: isDark ? 1 : 0,
          transform: isDark ? "rotate(0deg) scale(1)" : "rotate(-45deg) scale(0.7)",
          color: "var(--color-warning-500)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <SunIcon size={16} />
      </span>

      {/* Moon — visible in light mode (click to switch to dark) */}
      <span
        style={{
          position: "absolute",
          transition: "opacity 200ms ease-out, transform 200ms ease-out",
          opacity: isDark ? 0 : 1,
          transform: isDark ? "rotate(45deg) scale(0.7)" : "rotate(0deg) scale(1)",
          color: "var(--color-primary-500)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <MoonIcon size={16} />
      </span>
    </button>
  );
}

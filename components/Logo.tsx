import React from "react";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  showWordmark?: boolean;
  className?: string;
}

const sizes = {
  sm: { icon: 24, fontSize: "1rem",    gap: "0.4rem" },
  md: { icon: 32, fontSize: "1.25rem", gap: "0.5rem" },
  lg: { icon: 40, fontSize: "1.5rem",  gap: "0.625rem" },
};

/**
 * Dayflow SVG Logo — coded wordmark + abstract sun-arc icon.
 * Uses currentColor so it recolors cleanly in dark/light mode.
 * The icon depicts a rising sun arc over a flowing horizon line,
 * visually nodding to "day" and "flow".
 */
export default function Logo({
  size = "md",
  showWordmark = true,
  className = "",
}: LogoProps) {
  const { icon, fontSize, gap } = sizes[size];

  return (
    <div
      className={className}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap,
        userSelect: "none",
      }}
      aria-label="Dayflow"
    >
      {/* ── Icon: sun-arc + horizon flow line ── */}
      <svg
        width={icon}
        height={icon}
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        style={{ flexShrink: 0 }}
      >
        {/* Gradient definition — primary to accent */}
        <defs>
          <linearGradient id="df-grad" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="var(--color-primary-500)" />
            <stop offset="100%" stopColor="var(--color-accent-500)" />
          </linearGradient>
          <linearGradient id="df-grad-light" x1="0" y1="10" x2="40" y2="30" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="var(--color-primary-400)" stopOpacity="0.3" />
            <stop offset="100%" stopColor="var(--color-accent-400)" stopOpacity="0.0" />
          </linearGradient>
        </defs>

        {/* Sun glow fill — subtle radial behind the arc */}
        <ellipse cx="20" cy="26" rx="13" ry="6" fill="url(#df-grad-light)" />

        {/* Sun body — circle rising above horizon */}
        <circle cx="20" cy="17" r="7" fill="url(#df-grad)" />

        {/* Sun rays — 4 short dashes radiating outward */}
        <g stroke="url(#df-grad)" strokeWidth="1.8" strokeLinecap="round">
          <line x1="20" y1="5"  x2="20" y2="7.5" />   {/* top */}
          <line x1="30.5" y1="10" x2="28.7" y2="11.8" /> {/* top-right */}
          <line x1="9.5" y1="10" x2="11.3" y2="11.8" />  {/* top-left */}
          <line x1="33" y1="17" x2="30.5" y2="17" />  {/* right */}
          <line x1="7" y1="17" x2="9.5" y2="17" />    {/* left */}
        </g>

        {/* Horizon / flow line — wavy, horizon motif */}
        <path
          d="M 5 27 Q 10 24.5 15 27 Q 20 29.5 25 27 Q 30 24.5 35 27"
          stroke="url(#df-grad)"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
          opacity="0.9"
        />

        {/* Lower flow line — fainter, offset */}
        <path
          d="M 8 31 Q 13 28.5 18 31 Q 23 33.5 28 31 Q 31 29.5 33 31"
          stroke="url(#df-grad)"
          strokeWidth="1.5"
          strokeLinecap="round"
          fill="none"
          opacity="0.45"
        />
      </svg>

      {/* ── Wordmark ── */}
      {showWordmark && (
        <span
          style={{
            fontSize,
            fontWeight: 700,
            letterSpacing: "-0.035em",
            fontFamily: "var(--font-sans)",
            color: "var(--color-text-primary)",
            lineHeight: 1,
            transition: "color var(--transition-base)",
          }}
        >
          Day
          <span style={{ color: "var(--color-primary-500)" }}>flow</span>
        </span>
      )}
    </div>
  );
}

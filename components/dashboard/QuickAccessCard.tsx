"use client";

import Link from "next/link";

interface QuickAccessCardProps {
  href?: string;
  onClick?: () => void;
  icon: React.ReactNode;
  label: string;
  description: string;
  accent?: string; // CSS color
  id: string;
}

/**
 * Animated quick-access card for the dashboard.
 * Hover: subtle lift + shadow + accent border highlight.
 */
export default function QuickAccessCard({
  href,
  onClick,
  icon,
  label,
  description,
  accent = "var(--color-primary-500)",
  id,
}: QuickAccessCardProps) {
  const cardStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: "0.875rem",
    padding: "1.5rem",
    borderRadius: "var(--radius-lg)",
    background: "var(--color-surface-elevated)",
    border: "1px solid var(--color-border)",
    boxShadow: "var(--shadow-card)",
    cursor: "pointer",
    textDecoration: "none",
    color: "inherit",
    transition:
      "transform var(--transition-base), box-shadow var(--transition-base), border-color var(--transition-base)",
    userSelect: "none",
  };

  const content = (
    <>
      {/* Icon blob */}
      <div
        style={{
          width: 44,
          height: 44,
          borderRadius: "var(--radius-md)",
          background: `color-mix(in srgb, ${accent} 12%, transparent)`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: accent,
          transition: "background-color var(--transition-base)",
          flexShrink: 0,
        }}
      >
        {icon}
      </div>

      <div>
        <div
          style={{
            fontWeight: 600,
            fontSize: "0.9375rem",
            color: "var(--color-text-primary)",
            marginBottom: "0.25rem",
          }}
        >
          {label}
        </div>
        <div style={{ fontSize: "0.8125rem", color: "var(--color-text-muted)", lineHeight: 1.4 }}>
          {description}
        </div>
      </div>
    </>
  );

  const handleMouseEnter = (e: React.MouseEvent<HTMLElement>) => {
    const el = e.currentTarget as HTMLElement;
    el.style.transform = "translateY(-2px)";
    el.style.boxShadow = "var(--shadow-card-hover)";
    el.style.borderColor = `color-mix(in srgb, ${accent} 40%, var(--color-border))`;
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLElement>) => {
    const el = e.currentTarget as HTMLElement;
    el.style.transform = "translateY(0)";
    el.style.boxShadow = "var(--shadow-card)";
    el.style.borderColor = "var(--color-border)";
  };

  if (onClick) {
    return (
      <button
        id={id}
        onClick={onClick}
        style={{ ...cardStyle, width: "100%", textAlign: "left", background: "var(--color-surface-elevated)" }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {content}
      </button>
    );
  }

  return (
    <Link
      id={id}
      href={href!}
      style={cardStyle}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {content}
    </Link>
  );
}

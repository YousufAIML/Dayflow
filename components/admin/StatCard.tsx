interface StatCardProps {
  id: string;
  label: string;
  value: number | string;
  icon: React.ReactNode;
  accent?: string;
  description?: string;
}

/**
 * Admin stat card with subtle left-accent border and icon blob.
 */
export default function StatCard({
  id,
  label,
  value,
  icon,
  accent = "var(--color-primary-500)",
  description,
}: StatCardProps) {
  return (
    <div
      id={id}
      className="card"
      style={{
        padding: "1.25rem 1.5rem",
        display: "flex",
        gap: "1rem",
        alignItems: "center",
        borderLeft: `3px solid ${accent}`,
      }}
    >
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
          flexShrink: 0,
        }}
      >
        {icon}
      </div>

      {/* Text */}
      <div style={{ minWidth: 0 }}>
        <div
          style={{
            fontSize: "1.75rem",
            fontWeight: 700,
            color: "var(--color-text-primary)",
            lineHeight: 1,
            marginBottom: "0.25rem",
          }}
        >
          {value}
        </div>
        <div style={{ fontSize: "0.875rem", color: "var(--color-text-secondary)", fontWeight: 500 }}>
          {label}
        </div>
        {description && (
          <div style={{ fontSize: "0.75rem", color: "var(--color-text-muted)", marginTop: "0.125rem" }}>
            {description}
          </div>
        )}
      </div>
    </div>
  );
}

interface ActivityEvent {
  id: string;
  type: "checkin" | "checkout" | "leave_requested" | "leave_approved" | "leave_rejected" | "profile_updated";
  description: string;
  timestamp: string; // ISO string
  status?: "success" | "warning" | "error" | "info";
}

interface ActivityFeedProps {
  events: ActivityEvent[];
}

function formatRelativeTime(isoString: string): string {
  const date = new Date(isoString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return "yesterday";
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

const typeConfig: Record<ActivityEvent["type"], { icon: React.ReactNode; color: string }> = {
  checkin: {
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <polyline points="17 11 12 6 7 11" /><line x1="12" y1="6" x2="12" y2="18" />
      </svg>
    ),
    color: "var(--color-success-500)",
  },
  checkout: {
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <polyline points="17 13 12 18 7 13" /><line x1="12" y1="6" x2="12" y2="18" />
      </svg>
    ),
    color: "var(--color-text-muted)",
  },
  leave_requested: {
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" />
      </svg>
    ),
    color: "var(--color-warning-500)",
  },
  leave_approved: {
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <polyline points="20 6 9 17 4 12" />
      </svg>
    ),
    color: "var(--color-success-500)",
  },
  leave_rejected: {
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
      </svg>
    ),
    color: "var(--color-error-500)",
  },
  profile_updated: {
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
      </svg>
    ),
    color: "var(--color-primary-500)",
  },
};

function EmptyState() {
  return (
    <div
      style={{
        textAlign: "center",
        padding: "2.5rem 1rem",
        color: "var(--color-text-muted)",
      }}
    >
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ margin: "0 auto 0.75rem", opacity: 0.4 }} aria-hidden="true">
        <circle cx="12" cy="12" r="10" /><path d="M12 8v4l3 3" />
      </svg>
      <p style={{ margin: 0, fontSize: "0.875rem" }}>No recent activity yet</p>
    </div>
  );
}

export default function ActivityFeed({ events }: ActivityFeedProps) {
  if (events.length === 0) return <EmptyState />;

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      {events.map((event, idx) => {
        const config = typeConfig[event.type];
        return (
          <div
            key={event.id}
            style={{
              display: "flex",
              gap: "0.875rem",
              alignItems: "flex-start",
              padding: "0.875rem 0",
              borderBottom: idx < events.length - 1 ? "1px solid var(--color-border-subtle)" : "none",
            }}
          >
            {/* Timeline dot + icon */}
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: "50%",
                background: `color-mix(in srgb, ${config.color} 14%, transparent)`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: config.color,
                flexShrink: 0,
                marginTop: 1,
              }}
            >
              {config.icon}
            </div>

            {/* Content */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ margin: 0, fontSize: "0.875rem", color: "var(--color-text-primary)", lineHeight: 1.4 }}>
                {event.description}
              </p>
              <p style={{ margin: "0.25rem 0 0", fontSize: "0.75rem", color: "var(--color-text-muted)" }}>
                {formatRelativeTime(event.timestamp)}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export type { ActivityEvent };

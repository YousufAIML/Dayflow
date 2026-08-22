export default function DashboardLoading() {
  return (
    <div style={{ padding: "2rem", maxWidth: 900, margin: "0 auto" }}>
      {/* Greeting skeleton */}
      <div style={{ marginBottom: "2rem" }}>
        <div className="skeleton" style={{ width: 220, height: 32, marginBottom: "0.5rem" }} />
        <div className="skeleton" style={{ width: 160, height: 18 }} />
      </div>

      {/* Quick access cards skeleton */}
      <div className="skeleton" style={{ width: 120, height: 18, marginBottom: "1rem" }} />
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          gap: "1rem",
          marginBottom: "2.5rem",
        }}
      >
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="skeleton"
            style={{ height: 120, borderRadius: "var(--radius-lg)" }}
          />
        ))}
      </div>

      {/* Activity feed skeleton */}
      <div className="skeleton" style={{ width: 140, height: 18, marginBottom: "1rem" }} />
      <div
        style={{
          border: "1px solid var(--color-border)",
          borderRadius: "var(--radius-lg)",
          padding: "1rem",
        }}
      >
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            style={{
              display: "flex",
              gap: "0.875rem",
              padding: "0.875rem 0",
              borderBottom: i < 3 ? "1px solid var(--color-border-subtle)" : "none",
            }}
          >
            <div className="skeleton" style={{ width: 28, height: 28, borderRadius: "50%", flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <div className="skeleton" style={{ width: "70%", height: 14, marginBottom: "0.375rem" }} />
              <div className="skeleton" style={{ width: "30%", height: 12 }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

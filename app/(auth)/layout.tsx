import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    template: "%s · Dayflow",
    default: "Sign in · Dayflow",
  },
};

/**
 * Auth layout — centered card design, no sidebar.
 * Used for /signin and /signup pages.
 */
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--color-surface)",
        padding: "1.5rem",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Ambient background blobs */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "-10%",
            right: "-5%",
            width: 480,
            height: 480,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, color-mix(in srgb, var(--color-primary-500) 12%, transparent) 0%, transparent 70%)",
            filter: "blur(40px)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-10%",
            left: "-5%",
            width: 400,
            height: 400,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, color-mix(in srgb, var(--color-accent-500) 10%, transparent) 0%, transparent 70%)",
            filter: "blur(40px)",
          }}
        />
      </div>

      {/* Content */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          width: "100%",
          maxWidth: 440,
        }}
      >
        {children}
      </div>
    </div>
  );
}

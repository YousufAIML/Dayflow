"use client";

import { usePathname } from "next/navigation";
import Sidebar from "./Sidebar";

interface AppShellProps {
  children: React.ReactNode;
}

/**
 * AppShell — wraps every protected page with the sidebar layout.
 * Provides the responsive sidebar/main layout and page-entry animation.
 * Uses CSS animation (page-enter class from globals.css) instead of
 * Framer Motion here so the shell itself stays a lightweight boundary.
 */
export default function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: "var(--color-surface)",
      }}
    >
      {/* Sidebar (desktop fixed, mobile bottom) */}
      <Sidebar />

      {/* Main content area */}
      <main
        id="main-content"
        style={{
          flex: 1,
          marginLeft: 0,
          paddingBottom: "5rem", // space for mobile bottom nav
          minWidth: 0,
        }}
        className="app-shell-main"
      >
        {/* Page wrapper — fade+slide in on every route change */}
        <div
          key={pathname}
          className="page-enter"
          style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
        >
          {children}
        </div>
      </main>

      {/* Responsive: shift main right on desktop to clear sidebar */}
      <style>{`
        @media (min-width: 768px) {
          .app-shell-main {
            margin-left: 240px !important;
            padding-bottom: 0 !important;
          }
        }
      `}</style>
    </div>
  );
}

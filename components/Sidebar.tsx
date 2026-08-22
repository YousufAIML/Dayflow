"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { useState } from "react";
import Logo from "./Logo";
import ThemeToggle from "./ThemeToggle";

/* ── Nav item definition ── */
interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
  adminOnly?: boolean;
}

/* ── Icons (inline SVG, stroke-based) ── */
const DashboardIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="3" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="14" width="7" height="7" rx="1" />
    <rect x="3" y="14" width="7" height="7" rx="1" />
  </svg>
);
const ProfileIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="8" r="4" />
    <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
  </svg>
);
const AttendanceIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <path d="M16 2v4M8 2v4M3 10h18" />
    <path d="M9 16l2 2 4-4" />
  </svg>
);
const LeaveIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="9" y1="13" x2="15" y2="13" />
    <line x1="9" y1="17" x2="11" y2="17" />
  </svg>
);
const PayrollIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="2" y="5" width="20" height="14" rx="2" />
    <path d="M2 10h20" />
    <path d="M7 15h.01M11 15h2" />
  </svg>
);
const AdminIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);
const LogoutIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

const navItems: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: <DashboardIcon /> },
  { href: "/profile",   label: "Profile",   icon: <ProfileIcon /> },
  { href: "/attendance",label: "Attendance", icon: <AttendanceIcon /> },
  { href: "/leave",     label: "Leave",      icon: <LeaveIcon /> },
  { href: "/payroll",   label: "Payroll",    icon: <PayrollIcon /> },
];

/* ── NavLink component ── */
function NavLink({ item, active, collapsed = false }: { item: NavItem; active: boolean; collapsed?: boolean }) {
  return (
    <Link
      href={item.href}
      title={collapsed ? item.label : undefined}
      style={{
        display: "flex",
        alignItems: "center",
        gap: collapsed ? 0 : "0.625rem",
        justifyContent: collapsed ? "center" : "flex-start",
        padding: collapsed ? "0.625rem" : "0.625rem 0.875rem",
        borderRadius: "var(--radius-md)",
        fontSize: "0.875rem",
        fontWeight: active ? 600 : 500,
        color: active ? "var(--color-primary-600)" : "var(--color-text-secondary)",
        background: active
          ? "color-mix(in srgb, var(--color-primary-500) 10%, transparent)"
          : "transparent",
        textDecoration: "none",
        transition: "all var(--transition-fast)",
        position: "relative",
        whiteSpace: "nowrap",
        overflow: "hidden",
      }}
      onMouseEnter={(e) => {
        if (!active) {
          (e.currentTarget as HTMLAnchorElement).style.backgroundColor =
            "var(--color-sidebar-hover)";
          (e.currentTarget as HTMLAnchorElement).style.color =
            "var(--color-text-primary)";
        }
      }}
      onMouseLeave={(e) => {
        if (!active) {
          (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "transparent";
          (e.currentTarget as HTMLAnchorElement).style.color = "var(--color-text-secondary)";
        }
      }}
    >
      {/* Active indicator bar */}
      {active && (
        <span
          style={{
            position: "absolute",
            left: 0,
            top: "50%",
            transform: "translateY(-50%)",
            width: 3,
            height: "60%",
            background: "var(--color-primary-500)",
            borderRadius: "0 2px 2px 0",
          }}
        />
      )}
      <span style={{ flexShrink: 0 }}>{item.icon}</span>
      {!collapsed && <span>{item.label}</span>}
    </Link>
  );
}

/* ── Main Sidebar ── */
export default function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);
  const isAdmin = session?.user?.role === "ADMIN";

  const visibleNav = isAdmin
    ? [{ href: "/admin", label: "Team", icon: <AdminIcon /> }, ...navItems]
    : navItems;

  return (
    <>
      {/* ── Desktop Sidebar ── */}
      <aside
        id="sidebar-desktop"
        style={{
          display: "none",
          flexDirection: "column",
          width: 240,
          minHeight: "100vh",
          background: "var(--color-sidebar)",
          borderRight: "1px solid var(--color-sidebar-border)",
          padding: "1.25rem 0.875rem",
          position: "fixed",
          left: 0,
          top: 0,
          bottom: 0,
          zIndex: 40,
          transition: "background-color var(--transition-base), border-color var(--transition-base)",
        }}
        className="sidebar-desktop"
      >
        {/* Logo */}
        <div style={{ padding: "0 0.25rem 1.5rem" }}>
          <Link href="/dashboard" style={{ textDecoration: "none" }}>
            <Logo size="md" />
          </Link>
        </div>

        {/* Nav */}
        <nav
          style={{ flex: 1, display: "flex", flexDirection: "column", gap: "0.25rem" }}
          aria-label="Main navigation"
        >
          {visibleNav.map((item) => (
            <NavLink
              key={item.href}
              item={item}
              active={pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href))}
            />
          ))}
        </nav>

        {/* Bottom: user info + logout + theme */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", paddingTop: "1rem", borderTop: "1px solid var(--color-border)" }}>
          {/* User info */}
          {session?.user && (
            <div style={{ padding: "0.5rem 0.875rem", fontSize: "0.8125rem" }}>
              <div style={{ fontWeight: 600, color: "var(--color-text-primary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {session.user.name ?? session.user.email}
              </div>
              <div style={{ color: "var(--color-text-muted)", fontSize: "0.75rem", marginTop: "0.125rem" }}>
                {isAdmin ? "Administrator" : "Employee"}
              </div>
            </div>
          )}

          {/* Theme toggle + Logout */}
          <div style={{ display: "flex", gap: "0.5rem", padding: "0 0.25rem" }}>
            <ThemeToggle />
            <button
              id="sidebar-logout-btn"
              onClick={() => signOut({ callbackUrl: "/signin" })}
              style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.5rem 0.75rem",
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--color-border)",
                background: "transparent",
                color: "var(--color-text-muted)",
                fontSize: "0.8125rem",
                fontWeight: 500,
                cursor: "pointer",
                transition: "all var(--transition-fast)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = "var(--color-error-50)";
                (e.currentTarget as HTMLButtonElement).style.color = "var(--color-error-600)";
                (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--color-error-500)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent";
                (e.currentTarget as HTMLButtonElement).style.color = "var(--color-text-muted)";
                (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--color-border)";
              }}
            >
              <LogoutIcon />
              Sign out
            </button>
          </div>
        </div>
      </aside>

      {/* ── Mobile Bottom Nav ── */}
      <nav
        id="mobile-bottom-nav"
        aria-label="Mobile navigation"
        style={{
          display: "none",
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          background: "var(--color-sidebar)",
          borderTop: "1px solid var(--color-sidebar-border)",
          padding: "0.5rem 0.5rem calc(0.5rem + env(safe-area-inset-bottom))",
        }}
        className="mobile-bottom-nav"
      >
        <div style={{ display: "flex", justifyContent: "space-around", alignItems: "center" }}>
          {visibleNav.slice(0, 5).map((item) => {
            const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "0.25rem",
                  padding: "0.5rem 0.75rem",
                  borderRadius: "var(--radius-md)",
                  fontSize: "0.6875rem",
                  fontWeight: active ? 600 : 400,
                  color: active ? "var(--color-primary-600)" : "var(--color-text-muted)",
                  textDecoration: "none",
                  transition: "color var(--transition-fast)",
                  minWidth: 52,
                }}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* ── Responsive CSS ── */}
      <style>{`
        @media (min-width: 768px) {
          .sidebar-desktop { display: flex !important; }
          .mobile-bottom-nav { display: none !important; }
        }
        @media (max-width: 767px) {
          .sidebar-desktop { display: none !important; }
          .mobile-bottom-nav { display: block !important; }
        }
      `}</style>
    </>
  );
}

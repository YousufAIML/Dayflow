import AppShell from "@/components/AppShell";

/**
 * Dashboard route group layout.
 * All protected pages (/dashboard, /profile, /admin, /attendance, /leave, /payroll)
 * render inside AppShell which provides the sidebar navigation.
 */
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppShell>{children}</AppShell>;
}

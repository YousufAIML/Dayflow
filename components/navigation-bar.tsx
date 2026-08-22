"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  CalendarDays, 
  Clock, 
  CheckCircle2, 
  DollarSign, 
  SlidersHorizontal, 
  BarChart3, 
  UserCircle2, 
  ShieldAlert,
  Sparkles
} from "lucide-react";
import { useState, useEffect } from "react";

export function NavigationBar() {
  const pathname = usePathname();
  const [activeRole, setActiveRole] = useState<"EMPLOYEE" | "ADMIN">("EMPLOYEE");
  const [userName, setUserName] = useState("Priya Sharma");

  useEffect(() => {
    // Check cookie or header preference if any
    const match = document.cookie.match(/dayflow_user_role=([^;]+)/);
    if (match && match[1] === "ADMIN") {
      setActiveRole("ADMIN");
      setUserName("Alex Morgan (Admin)");
    } else {
      setActiveRole("EMPLOYEE");
      setUserName("Priya Sharma (Frontend)");
    }
  }, []);

  const switchRole = (role: "EMPLOYEE" | "ADMIN") => {
    setActiveRole(role);
    document.cookie = `dayflow_user_role=${role}; path=/; max-age=86400`;
    if (role === "ADMIN") {
      setUserName("Alex Morgan (Admin)");
    } else {
      setUserName("Priya Sharma (Frontend)");
    }
    // Dispatch reload or event
    window.location.reload();
  };

  const navLinks = [
    {
      label: "Apply Leave",
      href: "/leaves/apply",
      icon: CalendarDays,
      role: "EMPLOYEE",
    },
    {
      label: "My Leaves",
      href: "/leaves/status",
      icon: Clock,
      role: "EMPLOYEE",
    },
    {
      label: "Leave Approvals",
      href: "/admin/leaves",
      icon: CheckCircle2,
      role: "ADMIN",
      badge: "Admin",
    },
    {
      label: "My Payroll",
      href: "/payroll",
      icon: DollarSign,
      role: "EMPLOYEE",
    },
    {
      label: "Payroll Admin",
      href: "/admin/payroll",
      icon: SlidersHorizontal,
      role: "ADMIN",
      badge: "Admin",
    },
    {
      label: "Reports",
      href: "/reports",
      icon: BarChart3,
      role: "ALL",
    },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200 bg-white/90 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-950/90">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {/* Brand & Logo */}
        <div className="flex items-center gap-3">
          <Link href="/leaves/apply" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 text-white shadow-md shadow-indigo-500/20">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-zinc-900 dark:text-white">
                Dayflow
              </span>
              <span className="ml-1.5 inline-flex items-center rounded-md bg-indigo-50 px-1.5 py-0.5 text-xs font-semibold text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-400">
                HRMS
              </span>
            </div>
          </Link>
        </div>

        {/* Navigation Tabs */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href || (link.href === "/leaves/apply" && pathname === "/leaves");
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all ${
                  isActive
                    ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 shadow-sm"
                    : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? "text-white dark:text-zinc-900" : "text-zinc-500"}`} />
                <span>{link.label}</span>
                {link.badge && (
                  <span className={`rounded px-1.5 py-0.2 text-[10px] font-semibold uppercase tracking-wider ${
                    isActive 
                      ? "bg-white/20 text-white dark:bg-black/10 dark:text-zinc-900" 
                      : "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                  }`}>
                    {link.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Role & Persona Switcher */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden sm:flex items-center rounded-lg border border-zinc-200 bg-zinc-50 p-0.5 dark:border-zinc-800 dark:bg-zinc-900 text-xs">
            <button
              onClick={() => switchRole("EMPLOYEE")}
              className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 font-medium transition-all ${
                activeRole === "EMPLOYEE"
                  ? "bg-white text-zinc-900 shadow-xs dark:bg-zinc-800 dark:text-white"
                  : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200"
              }`}
            >
              <UserCircle2 className="h-3.5 w-3.5 text-indigo-500" />
              Employee
            </button>
            <button
              onClick={() => switchRole("ADMIN")}
              className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 font-medium transition-all ${
                activeRole === "ADMIN"
                  ? "bg-white text-zinc-900 shadow-xs dark:bg-zinc-800 dark:text-white"
                  : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200"
              }`}
            >
              <ShieldAlert className="h-3.5 w-3.5 text-amber-500" />
              Admin/HR
            </button>
          </div>

          <div className="flex items-center gap-2 border-l border-zinc-200 pl-3 dark:border-zinc-800">
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center text-xs font-bold">
              {activeRole === "ADMIN" ? "AM" : "PS"}
            </div>
            <div className="hidden lg:block text-left">
              <p className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">{userName}</p>
              <p className="text-[10px] text-zinc-500 dark:text-zinc-400 uppercase tracking-wider font-mono">
                {activeRole}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile navigation row */}
      <div className="flex md:hidden overflow-x-auto px-4 py-2 border-t border-zinc-100 dark:border-zinc-800 gap-1 scrollbar-none">
        {navLinks.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href || (link.href === "/leaves/apply" && pathname === "/leaves");
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`whitespace-nowrap flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium ${
                isActive
                  ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900"
                  : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              <span>{link.label}</span>
            </Link>
          );
        })}
      </div>
    </header>
  );
}

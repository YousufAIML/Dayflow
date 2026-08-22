"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import Logo from "@/components/Logo";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-[#0a0a0b] overflow-hidden selection:bg-indigo-500/30">
      {/* Background Gradients */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-indigo-500/10 blur-[120px]" />
        <div className="absolute top-[20%] -right-[10%] w-[40%] h-[40%] rounded-full bg-violet-500/10 blur-[120px]" />
        <div className="absolute -bottom-[20%] left-[20%] w-[60%] h-[60%] rounded-full bg-blue-500/5 blur-[120px]" />
      </div>

      {/* Navbar */}
      <nav className="relative z-10 w-full border-b border-zinc-200/50 bg-white/50 backdrop-blur-md dark:border-zinc-800/50 dark:bg-zinc-950/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Logo size="md" />
            <div className="flex items-center gap-4">
              <Link
                href="/signin"
                className="text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors"
              >
                Sign in
              </Link>
              <Link
                href="/signin"
                className="rounded-full bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-all dark:bg-indigo-500 dark:hover:bg-indigo-400"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 mx-auto max-w-7xl px-4 pt-20 pb-32 sm:px-6 lg:px-8 lg:pt-32">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="inline-flex items-center rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-sm font-medium text-indigo-600 dark:text-indigo-400 mb-8"
          >
            <span className="flex h-2 w-2 rounded-full bg-indigo-600 dark:bg-indigo-400 mr-2 animate-pulse" />
            Dayflow Hackathon Edition
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
            className="mx-auto max-w-4xl text-5xl font-extrabold tracking-tight text-zinc-900 sm:text-7xl dark:text-white"
          >
            Every workday,{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-violet-500">
              perfectly aligned.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
            className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-zinc-600 dark:text-zinc-400"
          >
            The modern HRMS built for speed, clarity, and simplicity. Manage attendance, process leave requests, and automate payroll all in one beautiful dashboard.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
            className="mt-10 flex items-center justify-center gap-x-6"
          >
            <Link
              href="/signin"
              className="rounded-full bg-indigo-600 px-8 py-3.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-all dark:bg-indigo-500 dark:hover:bg-indigo-400"
            >
              Go to Dashboard
            </Link>
            <a
              href="#features"
              className="text-sm font-semibold leading-6 text-zinc-900 dark:text-white group flex items-center gap-1"
            >
              Learn more <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">→</span>
            </a>
          </motion.div>
        </div>
      </main>

      {/* Features Grid */}
      <section id="features" className="relative z-10 py-24 sm:py-32 bg-white/40 dark:bg-zinc-900/40 backdrop-blur-xl border-y border-zinc-200/50 dark:border-zinc-800/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-base font-semibold leading-7 text-indigo-600 dark:text-indigo-400">Everything you need</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl dark:text-white">
              No clutter, just results
            </p>
          </div>

          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
              {[
                {
                  name: "Smart Attendance",
                  description: "Real-time check-ins and check-outs. Managers can view daily attendance metrics at a glance.",
                  icon: (
                    <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                    </svg>
                  ),
                },
                {
                  name: "Seamless Leave Routing",
                  description: "Employees apply in seconds. Managers approve or reject with one click from the admin dashboard.",
                  icon: (
                    <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
                    </svg>
                  ),
                },
                {
                  name: "Automated Payroll",
                  description: "Salary slips, deductions, and allowances automatically calculated and distributed every month.",
                  icon: (
                    <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                    </svg>
                  ),
                },
              ].map((feature) => (
                <motion.div
                  whileHover={{ y: -5 }}
                  key={feature.name}
                  className="flex flex-col p-8 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm transition-all hover:shadow-md dark:hover:border-indigo-500/50"
                >
                  <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-zinc-900 dark:text-white">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600 dark:bg-indigo-500 shadow-sm">
                      {feature.icon}
                    </div>
                    {feature.name}
                  </dt>
                  <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-zinc-600 dark:text-zinc-400">
                    <p className="flex-auto">{feature.description}</p>
                  </dd>
                </motion.div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-zinc-50 dark:bg-[#0a0a0b] py-12 text-center border-t border-zinc-200/50 dark:border-zinc-800/50 relative z-10">
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          © {new Date().getFullYear()} Dayflow Hackathon Demo. All rights reserved.
        </p>
      </footer>
    </div>
  );
}

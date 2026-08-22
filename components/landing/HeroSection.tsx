"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

export default function HeroSection() {
  return (
    <section className="relative pt-32 pb-20 sm:pt-40 sm:pb-24 overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-[var(--color-primary-500)]/10 blur-[120px]" />
        <div className="absolute top-[20%] -right-[10%] w-[40%] h-[40%] rounded-full bg-[var(--color-accent-500)]/10 blur-[120px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="inline-flex items-center rounded-full border border-[var(--color-primary-500)]/30 bg-[var(--color-primary-500)]/10 px-3 py-1 text-sm font-medium text-[var(--color-primary-600)] dark:text-[var(--color-primary-400)] mb-8"
        >
          <span className="flex h-2 w-2 rounded-full bg-[var(--color-primary-600)] dark:bg-[var(--color-primary-400)] mr-2 animate-pulse" />
          Dayflow 1.0 is now live
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
          className="mx-auto max-w-5xl text-5xl font-extrabold tracking-tight text-zinc-900 sm:text-7xl dark:text-white"
        >
          Align Your Workforce.{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-primary-500)] to-[var(--color-accent-500)]">
            Automate the Rest.
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
          className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-[var(--color-text-secondary)]"
        >
          The modern HRMS built for speed and clarity. Track attendance, manage leave requests, and automate payroll seamlessly in one beautiful dashboard.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link href="/signup" className="btn-primary w-full sm:w-auto px-8 py-3.5 text-base">
            Get Started for Free
          </Link>
          <a href="#features" className="btn-ghost w-full sm:w-auto px-8 py-3.5 text-base">
            Explore Features
          </a>
        </motion.div>

        {/* Hero Image */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5, ease: "easeOut" }}
          className="mt-16 sm:mt-24 relative mx-auto max-w-5xl"
        >
          <div className="rounded-[var(--radius-xl)] bg-[var(--color-surface-elevated)] p-2 sm:p-4 shadow-2xl ring-1 ring-[var(--color-border)] dark:ring-[var(--color-border-subtle)]">
            <div className="overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] aspect-video relative">
              <Image
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=2000&ixlib=rb-4.0.3"
                alt="Modern team collaborating"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

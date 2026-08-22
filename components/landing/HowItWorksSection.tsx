"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const steps = [
  {
    id: "01",
    name: "Invite your team",
    description: "Create employee profiles in seconds. Assign roles, departments, and base salaries from the Admin dashboard.",
  },
  {
    id: "02",
    name: "Log daily activity",
    description: "Employees use their portal to clock in and out, while checking their leave balances and applying for time off.",
  },
  {
    id: "03",
    name: "Approve & Oversee",
    description: "Managers review leave requests and attendance logs, maintaining full visibility over workforce availability.",
  },
  {
    id: "04",
    name: "Run Payroll",
    description: "At the end of the month, generate beautiful, compliant payslips with automated deduction calculations instantly.",
  },
];

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-24 sm:py-32 overflow-hidden bg-[var(--color-surface)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center mb-16 sm:mb-24">
          <h2 className="text-base font-semibold leading-7 text-[var(--color-primary-600)] dark:text-[var(--color-primary-400)]">
            Workflow
          </h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-[var(--color-text-primary)] sm:text-4xl">
            How Dayflow works
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Steps List */}
          <div className="space-y-12">
            {steps.map((step, index) => (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                className="relative pl-16"
              >
                <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-primary-50)] dark:bg-[var(--color-primary-900)]/30 border border-[var(--color-primary-100)] dark:border-[var(--color-primary-800)]/50">
                  <span className="text-sm font-bold text-[var(--color-primary-600)] dark:text-[var(--color-primary-400)]">
                    {step.id}
                  </span>
                </div>
                {/* Connecting line for all but last */}
                {index !== steps.length - 1 && (
                  <div className="absolute left-[1.2rem] top-12 h-[calc(100%+1rem)] w-px bg-[var(--color-border)] dark:bg-[var(--color-border-subtle)]" />
                )}
                
                <h3 className="text-xl font-semibold text-[var(--color-text-primary)] mb-2">
                  {step.name}
                </h3>
                <p className="text-base text-[var(--color-text-secondary)] leading-7">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Supporting Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="relative lg:ml-auto w-full max-w-lg aspect-[4/5] rounded-[var(--radius-xl)] overflow-hidden shadow-2xl border border-[var(--color-border)]"
          >
            <Image
              src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=1200&ixlib=rb-4.0.3"
              alt="Team planning session"
              fill
              className="object-cover"
            />
            {/* Soft overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-surface)]/80 via-transparent to-transparent" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

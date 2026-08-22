"use client";

import { motion } from "framer-motion";
import { Clock, Calendar, Banknote, Shield } from "lucide-react";

const features = [
  {
    name: "Smart Attendance Tracking",
    description: "Real-time check-ins and check-outs. Employees log their hours effortlessly, while managers get instant weekly visual dashboards of team activity.",
    icon: Clock,
  },
  {
    name: "Seamless Leave Routing",
    description: "Submit Paid, Sick, or Unpaid leave requests in seconds. Managers receive instant notifications to approve or reject with a single click.",
    icon: Calendar,
  },
  {
    name: "Automated Payroll",
    description: "Base salaries, custom allowances, and automated deductions. Generate accurate, downloadable monthly payslips without the manual math.",
    icon: Banknote,
  },
  {
    name: "Admin Command Center",
    description: "Complete oversight over your organization. Manage employee profiles, roles, and review company-wide attendance and leave statuses at a glance.",
    icon: Shield,
  },
];

export default function FeaturesSection() {
  return (
    <section id="features" className="py-24 sm:py-32 bg-[var(--color-surface-elevated)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-base font-semibold leading-7 text-[var(--color-primary-600)] dark:text-[var(--color-primary-400)]">
            Everything you need
          </h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-[var(--color-text-primary)] sm:text-4xl">
            No clutter, just results
          </p>
          <p className="mt-6 text-lg leading-8 text-[var(--color-text-secondary)]">
            Dayflow is designed to get out of your way. Our core modules handle the heavy lifting so you can focus on building your business.
          </p>
        </div>

        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-2">
            {features.map((feature, index) => (
              <motion.div
                key={feature.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="flex flex-col p-8 rounded-[var(--radius-xl)] bg-[var(--color-surface)] border border-[var(--color-border)] shadow-[var(--shadow-card)] transition-all hover:shadow-[var(--shadow-card-hover)]"
              >
                <dt className="flex items-center gap-x-4 text-xl font-semibold leading-7 text-[var(--color-text-primary)]">
                  <div className="flex h-12 w-12 items-center justify-center rounded-[var(--radius-lg)] bg-[var(--color-primary-50)] text-[var(--color-primary-600)] dark:bg-[var(--color-primary-900)]/30 dark:text-[var(--color-primary-400)]">
                    <feature.icon className="h-6 w-6" aria-hidden="true" />
                  </div>
                  {feature.name}
                </dt>
                <dd className="mt-6 flex flex-auto flex-col text-base leading-7 text-[var(--color-text-secondary)]">
                  <p className="flex-auto">{feature.description}</p>
                </dd>
              </motion.div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}

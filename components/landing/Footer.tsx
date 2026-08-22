"use client";

import Link from "next/link";
import Logo from "@/components/Logo";

export default function Footer() {
  return (
    <footer className="bg-[var(--color-surface-elevated)] border-t border-[var(--color-border)] py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col items-center md:items-start gap-4">
            <Logo size="sm" />
            <p className="text-sm text-[var(--color-text-muted)] text-center md:text-left max-w-xs">
              Every workday, perfectly aligned. The modern HRMS built for speed, clarity, and simplicity.
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-4">
            <a href="#features" className="text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors">
              Features
            </a>
            <a href="#how-it-works" className="text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors">
              How it Works
            </a>
            <Link href="/signin" className="text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors">
              Sign In
            </Link>
            <Link href="/signup" className="text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors">
              Sign Up
            </Link>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-[var(--color-border-subtle)] text-center">
          <p className="text-xs text-[var(--color-text-muted)]">
            © {new Date().getFullYear()} Dayflow Hackathon Demo. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

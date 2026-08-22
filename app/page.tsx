import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import type { Metadata } from "next";

import LandingNavbar from "@/components/landing/LandingNavbar";
import HeroSection from "@/components/landing/HeroSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import HowItWorksSection from "@/components/landing/HowItWorksSection";
import Footer from "@/components/landing/Footer";

export const metadata: Metadata = {
  title: "Dayflow — Align Your Workforce",
  description: "The modern HRMS built for speed and clarity. Track attendance, manage leave requests, and automate payroll seamlessly in one beautiful dashboard.",
};

export default async function LandingPage() {
  const session = await getSession();

  // If user is already authenticated, send them straight to the dashboard.
  if (session) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-[var(--color-surface)] text-[var(--color-text-primary)] selection:bg-[var(--color-primary-200)] selection:text-[var(--color-primary-900)] dark:selection:bg-[var(--color-primary-800)] dark:selection:text-[var(--color-primary-100)]">
      <LandingNavbar />
      <main>
        <HeroSection />
        <FeaturesSection />
        <HowItWorksSection />
      </main>
      <Footer />
    </div>
  );
}

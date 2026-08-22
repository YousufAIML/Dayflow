import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "@/providers/Providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Dayflow · Every workday, perfectly aligned",
    template: "%s · Dayflow",
  },
  description:
    "Dayflow is a modern HRMS for managing employees, attendance, leave, and payroll — every workday, perfectly aligned.",
  keywords: ["HRMS", "HR management", "attendance", "leave management", "payroll"],
  authors: [{ name: "Dayflow Team" }],
  openGraph: {
    title: "Dayflow · Every workday, perfectly aligned",
    description: "Modern HRMS for seamless workforce management.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={inter.variable}
    >
      <body style={{ fontFamily: "var(--font-sans)" }}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

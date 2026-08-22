"use client";

import { ThemeProvider } from "next-themes";
import { SessionProvider } from "next-auth/react";

/**
 * Client-side providers wrapper.
 * Combines ThemeProvider (next-themes, class strategy) and
 * NextAuth SessionProvider so all child components can use
 * useTheme() and useSession() anywhere in the tree.
 */
export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange={false}
    >
      <SessionProvider>{children}</SessionProvider>
    </ThemeProvider>
  );
}

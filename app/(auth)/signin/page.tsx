import type { Metadata } from "next";
import { Suspense } from "react";
import SigninForm from "@/components/auth/SigninForm";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to your Dayflow account.",
};

export default function SigninPage() {
  return (
    <Suspense fallback={null}>
      <SigninForm />
    </Suspense>
  );
}

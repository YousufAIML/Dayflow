import type { Metadata } from "next";
import SignupForm from "@/components/auth/SignupForm";

export const metadata: Metadata = {
  title: "Create Account",
  description: "Create your Dayflow account to manage your workday.",
};

export default function SignupPage() {
  return <SignupForm />;
}

import { NavigationBar } from "@/components/navigation-bar";
import { LeaveApplicationForm } from "@/components/leave-application-form";

export const metadata = {
  title: "Apply for Leave | Dayflow HRMS",
  description: "Employee leave application portal with live balance check and automated approval routing.",
};

export default function ApplyLeavePage() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black text-zinc-900 dark:text-zinc-50">
      <NavigationBar />
      <main className="py-6">
        <LeaveApplicationForm />
      </main>
    </div>
  );
}

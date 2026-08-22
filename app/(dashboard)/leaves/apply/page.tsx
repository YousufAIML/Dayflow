import { LeaveApplicationForm } from "@/components/leave-application-form";

export const metadata = {
  title: "Apply for Leave | Dayflow HRMS",
  description: "Employee leave application portal with live balance check and automated approval routing.",
};

export default function ApplyLeavePage() {
  return (
    <div className="py-6">
      <LeaveApplicationForm />
    </div>
  );
}

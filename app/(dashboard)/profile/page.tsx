import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import ProfileForm from "@/components/profile/ProfileForm";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "My Profile" };

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/signin");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { payroll: true },
  });

  if (!user) redirect("/signin");

  const { password: _pw, ...safeUser } = user;

  const profileData = {
    ...safeUser,
    dateJoined: safeUser.dateJoined.toISOString(),
    updatedAt: safeUser.updatedAt.toISOString(),
    createdAt: undefined,
    payroll: safeUser.payroll
      ? {
          baseSalary: safeUser.payroll.baseSalary,
          allowances: safeUser.payroll.allowances,
          deductions: safeUser.payroll.deductions,
        }
      : null,
  };

  return (
    <ProfileForm
      initialData={profileData}
      isAdminView={false}
    />
  );
}

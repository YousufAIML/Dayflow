import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import ProfileForm from "@/components/profile/ProfileForm";
import type { Metadata } from "next";

export async function generateMetadata(
  props: { params: Promise<{ id: string }> }
): Promise<Metadata> {
  const { id } = await props.params;
  const user = await prisma.user.findUnique({
    where: { id },
    select: { fullName: true },
  });
  return { title: user?.fullName ? `${user.fullName} · Profile` : "Employee Profile" };
}

export default async function AdminEmployeeProfilePage(
  props: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/signin");
  if (session.user.role !== "ADMIN") redirect("/profile");

  const { id } = await props.params;

  const user = await prisma.user.findUnique({
    where: { id },
    include: { payroll: true },
  });

  if (!user) notFound();

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
      targetUserId={id}
      isAdminView={true}
    />
  );
}

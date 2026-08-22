import bcrypt from "bcryptjs";
import { prisma } from "../lib/prisma";

async function main() {
  console.log("🌱 Seeding Dayflow demo data...");

  const hash = await bcrypt.hash("Demo@123", 10);

  // ── Users ─────────────────────────────────────────────────────────────
  const admin = await prisma.user.upsert({
    where: { employeeId: "EMP001" },
    update: {},
    create: {
      employeeId: "EMP001",
      email: "admin@dayflow.io",
      password: hash,
      role: "ADMIN",
      fullName: "Arjun Sharma",
      phone: "9876543210",
      jobTitle: "HR Manager",
      department: "Human Resources",
      emailVerified: true,
      address: "123 Tech Park, MG Road, Bangalore",
      profilePic: "https://api.dicebear.com/7.x/avataaars/svg?seed=Arjun",
    },
  });

  const emp1 = await prisma.user.upsert({
    where: { employeeId: "EMP002" },
    update: {},
    create: {
      employeeId: "EMP002",
      email: "priya@dayflow.io",
      password: hash,
      role: "EMPLOYEE",
      fullName: "Priya Nair",
      phone: "9123456789",
      jobTitle: "Software Engineer",
      department: "Engineering",
      emailVerified: true,
      address: "456 Cyber City, DLF Phase 3, Gurgaon",
      profilePic: "https://api.dicebear.com/7.x/avataaars/svg?seed=Priya",
    },
  });

  const emp2 = await prisma.user.upsert({
    where: { employeeId: "EMP003" },
    update: {},
    create: {
      employeeId: "EMP003",
      email: "rohit@dayflow.io",
      password: hash,
      role: "EMPLOYEE",
      fullName: "Rohit Verma",
      phone: "9988776655",
      jobTitle: "Product Designer",
      department: "Design",
      emailVerified: true,
      address: "789 Startup Village, Koramangala, Bangalore",
      profilePic: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rohit",
    },
  });

  console.log(`✅ Users: ${admin.fullName}, ${emp1.fullName}, ${emp2.fullName}`);

  // ── Attendance: last 14 days ──────────────────────────────────────────
  const statuses: Array<"PRESENT" | "ABSENT" | "HALF_DAY" | "LEAVE"> = [
    "PRESENT", "PRESENT", "PRESENT", "HALF_DAY", "PRESENT",
    "ABSENT",  "PRESENT", "PRESENT", "PRESENT",  "LEAVE",
    "PRESENT", "PRESENT", "HALF_DAY","PRESENT",
  ];

  const now = new Date();
  let attendanceCount = 0;

  for (let i = 13; i >= 0; i--) {
    const dayOffset = -i;
    const dateUTC = new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + dayOffset)
    );

    // Skip weekends
    const dow = dateUTC.getUTCDay(); // 0=Sun, 6=Sat
    if (dow === 0 || dow === 6) continue;

    const status = statuses[i % statuses.length];

    for (const user of [admin, emp1, emp2]) {
      // Vary status slightly per user
      const userStatus =
        user.id === emp2.id && status === "ABSENT" ? "PRESENT" : status;

      const checkIn =
        userStatus !== "ABSENT" && userStatus !== "LEAVE"
          ? new Date(dateUTC.getTime() + 3 * 60 * 60 * 1000 + // UTC+5:30 = 9:00 IST
              Math.floor(Math.random() * 30) * 60 * 1000) // ±30min jitter
          : null;

      const checkOut = checkIn
        ? new Date(
            checkIn.getTime() +
              (userStatus === "HALF_DAY"
                ? 4 * 60 + 30
                : 8 * 60 + Math.floor(Math.random() * 60)) *
                60 *
                1000
          )
        : null;

      await prisma.attendance.upsert({
        where: {
          // no unique constraint on (userId, date), so use findFirst + create pattern
          id: `seed-${user.id}-${dateUTC.toISOString().slice(0, 10)}`,
        },
        update: { checkIn, checkOut, status: userStatus },
        create: {
          id: `seed-${user.id}-${dateUTC.toISOString().slice(0, 10)}`,
          userId: user.id,
          date: dateUTC,
          checkIn,
          checkOut,
          status: userStatus,
        },
      });
      attendanceCount++;
    }
  }

  console.log(`✅ Attendance: ${attendanceCount} records seeded`);

  // ── Leave Requests ────────────────────────────────────────────────────
  await prisma.leaveRequest.upsert({
    where: { id: "seed-leave-001" },
    update: {},
    create: {
      id: "seed-leave-001",
      userId: emp1.id,
      type: "SICK",
      startDate: new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 2)),
      endDate:   new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 3)),
      remarks: "Fever",
      status: "APPROVED",
      comment: "Admin: Approved. Please take care and submit the doctor's note when you return.",
    },
  });

  await prisma.leaveRequest.upsert({
    where: { id: "seed-leave-002" },
    update: {},
    create: {
      id: "seed-leave-002",
      userId: emp2.id,
      type: "PAID",
      startDate: new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 5)),
      endDate:   new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 7)),
      remarks: "Family vacation",
      status: "PENDING",
    },
  });

  console.log("✅ Leave requests seeded");

  // ── Payslips: Last 3 months ───────────────────────────────────────────
  const currentMonth = now.getUTCMonth() + 1; // 1-12
  const currentYear = now.getUTCFullYear();
  let payslipCount = 0;

  for (const user of [admin, emp1, emp2]) {
    const baseSalaries: Record<string, number> = {
      EMP001: 150000,
      EMP002: 80000,
      EMP003: 95000,
    };
    const basicSalary = baseSalaries[user.employeeId] || 75000;
    
    for (let i = 0; i < 3; i++) {
      let m = currentMonth - i;
      let y = currentYear;
      if (m <= 0) {
        m += 12;
        y -= 1;
      }
      
      const status = i === 0 ? "PENDING" : "PAID";
      const allowances = 15000;
      const deductions = 5000;
      const netPay = basicSalary + allowances - deductions;

      await prisma.payslip.upsert({
        where: { id: `seed-payslip-${user.id}-${y}-${m}` },
        update: {},
        create: {
          id: `seed-payslip-${user.id}-${y}-${m}`,
          userId: user.id,
          month: m,
          year: y,
          basicSalary,
          allowances,
          deductions,
          netPay,
          status,
        },
      });
      payslipCount++;
    }
  }

  console.log(`✅ Payslips: ${payslipCount} records seeded`);

  console.log("\n🎉 Seed complete!");
  console.log("─────────────────────────────────────────");
  console.log("Demo credentials (password: Demo@123):");
  console.log(`  Admin   : admin@dayflow.io  (${admin.id})`);
  console.log(`  Employee: priya@dayflow.io  (${emp1.id})`);
  console.log(`  Employee: rohit@dayflow.io  (${emp2.id})`);
  console.log("─────────────────────────────────────────");
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

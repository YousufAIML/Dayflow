import { prisma } from "./prisma";

export async function ensureSeedData() {
  try {
    const userCount = await prisma.user.count();
    if (userCount > 0) {
      return;
    }

    // Seed default admin and employees
    const admin = await prisma.user.create({
      data: {
        employeeId: "EMP001",
        email: "alex.morgan@dayflow.io",
        password: "hashed_password_placeholder",
        role: "ADMIN",
        fullName: "Alex Morgan",
        jobTitle: "Head of People & HR",
        department: "Human Resources",
        phone: "+1 (555) 019-2834",
        address: "742 Evergreen Terrace, Springfield",
      },
    });

    const emp1 = await prisma.user.create({
      data: {
        employeeId: "EMP101",
        email: "priya.sharma@dayflow.io",
        password: "hashed_password_placeholder",
        role: "EMPLOYEE",
        fullName: "Priya Sharma",
        jobTitle: "Senior Frontend Engineer",
        department: "Engineering",
        phone: "+1 (555) 234-5678",
        address: "104 Innovation Way, Tech Park",
      },
    });

    const emp2 = await prisma.user.create({
      data: {
        employeeId: "EMP102",
        email: "marcus.vance@dayflow.io",
        password: "hashed_password_placeholder",
        role: "EMPLOYEE",
        fullName: "Marcus Vance",
        jobTitle: "Senior Backend Engineer",
        department: "Engineering",
        phone: "+1 (555) 345-6789",
        address: "512 Cloud Blvd, Silicon Valley",
      },
    });

    const emp3 = await prisma.user.create({
      data: {
        employeeId: "EMP103",
        email: "elena.rostova@dayflow.io",
        password: "hashed_password_placeholder",
        role: "EMPLOYEE",
        fullName: "Elena Rostova",
        jobTitle: "Lead UI/UX Designer",
        department: "Design",
        phone: "+1 (555) 456-7890",
        address: "88 Palette Street, Art District",
      },
    });

    const emp4 = await prisma.user.create({
      data: {
        employeeId: "EMP104",
        email: "david.kim@dayflow.io",
        password: "hashed_password_placeholder",
        role: "EMPLOYEE",
        fullName: "David Kim",
        jobTitle: "DevOps & Infrastructure Lead",
        department: "Engineering",
        phone: "+1 (555) 567-8901",
        address: "303 Matrix Avenue, Cyber City",
      },
    });

    // Seed Payrolls
    await prisma.payroll.createMany({
      data: [
        {
          userId: admin.id,
          baseSalary: 9500,
          allowances: 1800,
          deductions: 1200,
        },
        {
          userId: emp1.id,
          baseSalary: 8500,
          allowances: 1500,
          deductions: 950,
        },
        {
          userId: emp2.id,
          baseSalary: 8200,
          allowances: 1400,
          deductions: 900,
        },
        {
          userId: emp3.id,
          baseSalary: 7800,
          allowances: 1300,
          deductions: 850,
        },
        {
          userId: emp4.id,
          baseSalary: 8900,
          allowances: 1600,
          deductions: 1000,
        },
      ],
    });

    // Seed sample Leave Requests
    const now = new Date();
    const pastStart1 = new Date(now.getFullYear(), now.getMonth(), 3);
    const pastEnd1 = new Date(now.getFullYear(), now.getMonth(), 5);

    const pastStart2 = new Date(now.getFullYear(), now.getMonth(), 10);
    const pastEnd2 = new Date(now.getFullYear(), now.getMonth(), 11);

    const futureStart1 = new Date(now.getFullYear(), now.getMonth() + 1, 15);
    const futureEnd1 = new Date(now.getFullYear(), now.getMonth() + 1, 18);

    const futureStart2 = new Date(now.getFullYear(), now.getMonth() + 1, 22);
    const futureEnd2 = new Date(now.getFullYear(), now.getMonth() + 1, 23);

    await prisma.leaveRequest.createMany({
      data: [
        {
          userId: emp1.id,
          type: "PAID",
          startDate: pastStart1,
          endDate: pastEnd1,
          remarks: "Attending annual developer summit and hackathon.",
          status: "APPROVED",
          comment: "Approved. Enjoy the conference!",
          createdAt: new Date(now.getFullYear(), now.getMonth(), 1),
        },
        {
          userId: emp1.id,
          type: "SICK",
          startDate: pastStart2,
          endDate: pastEnd2,
          remarks: "Flu and high fever. Doctor recommended 2 days rest.",
          status: "APPROVED",
          comment: "Approved. Take care and get well soon.",
          createdAt: new Date(now.getFullYear(), now.getMonth(), 9),
        },
        {
          userId: emp2.id,
          type: "PAID",
          startDate: futureStart1,
          endDate: futureEnd1,
          remarks: "Family vacation to the mountains.",
          status: "PENDING",
          createdAt: new Date(now.getTime() - 86400000 * 2),
        },
        {
          userId: emp3.id,
          type: "UNPAID",
          startDate: futureStart2,
          endDate: futureEnd2,
          remarks: "Personal matters requiring time off.",
          status: "PENDING",
          createdAt: new Date(now.getTime() - 86400000 * 1),
        },
      ],
    });

    // Seed Attendance for reports
    const attendanceRecords = [];
    for (let i = 1; i <= 14; i++) {
      const d = new Date(now.getFullYear(), now.getMonth(), i);
      // Skip weekends
      if (d.getDay() === 0 || d.getDay() === 6) continue;

      const users = [admin.id, emp1.id, emp2.id, emp3.id, emp4.id];
      for (const uid of users) {
        // randomly vary slightly for realistic dashboard percentages
        const isAbsent = (i + uid.charCodeAt(0)) % 13 === 0;
        const isHalfDay = (i + uid.charCodeAt(1)) % 17 === 0;
        
        let status: "PRESENT" | "ABSENT" | "HALF_DAY" | "LEAVE" = "PRESENT";
        if (isAbsent) status = "ABSENT";
        else if (isHalfDay) status = "HALF_DAY";

        attendanceRecords.push({
          userId: uid,
          date: d,
          checkIn: status !== "ABSENT" ? new Date(d.setHours(9, 15, 0)) : null,
          checkOut: status !== "ABSENT" ? new Date(d.setHours(18, 0, 0)) : null,
          status,
        });
      }
    }

    if (attendanceRecords.length > 0) {
      await prisma.attendance.createMany({
        data: attendanceRecords,
      });
    }

  } catch (err) {
    console.error("Seed data error (non-fatal):", err);
  }
}

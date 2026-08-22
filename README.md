# 🌴 Dayflow

> Every workday, perfectly aligned.

Dayflow is a modern, full-stack Human Resource Management System (HRMS) built to manage employees, track attendance, handle leave requests, and generate payroll—all wrapped in a stunning, highly polished user interface with flawless Light and Dark mode support.

## ✨ Features

- **🛡️ Role-Based Access Control:** Secure authentication with Admin and Employee portals.
- **📅 Leave Management:** Employees can request Paid, Sick, and Unpaid leaves. Automated balance tracking and Admin approval workflows.
- **⏱️ Attendance Tracking:** Daily check-ins, check-outs, and a weekly activity dashboard visualizing hours worked.
- **💸 Payroll System:** Automated payslip generation outlining basic salary, allowances, deductions, and net pay.
- **👤 Employee Profiles:** Manage contact details, roles, departments, and profile avatars.
- **🎨 Flawless UI/UX:** Built on Tailwind v4, utilizing CSS-first design tokens for perfect Dark Mode integration and Framer Motion for micro-animations.

---

## 🛠️ Tech Stack

- **Framework:** [Next.js 16 (App Router)](https://nextjs.org/)
- **Database:** [PostgreSQL (Neon serverless)](https://neon.tech/)
- **ORM:** [Prisma v7](https://www.prisma.io/)
- **Authentication:** [NextAuth.js v4](https://next-auth.js.org/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Animations:** [Framer Motion](https://www.framer.com/motion/)
- **Validation:** [Zod](https://zod.dev/)

---

## 🚀 Getting Started

Follow these instructions to set up the project locally on your machine.

### 1. Prerequisites
Ensure you have the following installed:
- Node.js (v18 or higher)
- npm or yarn
- A PostgreSQL database (e.g., local Postgres or a Neon serverless Postgres instance)

### 2. Clone and Install
```bash
git clone https://github.com/your-username/dayflow.git
cd dayflow
npm install
```

### 3. Setup Environment Variables
Create a `.env` file in the root of the project based on the variables required:
```env
# Database Connection (Neon Postgres recommended)
DATABASE_URL="postgresql://user:password@host.aws.neon.tech/neondb?sslmode=require"

# NextAuth Configuration
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-super-secret-jwt-key"
```

### 4. Database Setup & Seeding
Push the database schema and generate the Prisma client:
```bash
npx prisma generate
npx prisma db push
```

Seed the database with the initial Admin and Employee accounts:
```bash
npm run seed
```
> **Default Accounts Created by Seeding:**
> - Admin: `admin@dayflow.com` (password: `admin123`)
> - Employee: `employee@dayflow.com` (password: `employee123`)

### 5. Run the Development Server
Start the Next.js development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application in action.

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the issues page if you want to contribute.

## 📝 License

This project is licensed under the MIT License.

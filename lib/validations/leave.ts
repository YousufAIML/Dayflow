import { z } from "zod";

export const leaveTypeEnum = z.enum(["PAID", "SICK", "UNPAID"], {
  message: "Please select a valid leave type.",
});

export const createLeaveSchema = z
  .object({
    type: leaveTypeEnum,
    startDate: z
      .string()
      .min(1, "Start date is required")
      .refine(
        (val) => {
          const date = new Date(val);
          if (isNaN(date.getTime())) return false;
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          // Compare day start in local time
          const checkDate = new Date(val + "T00:00:00");
          return checkDate >= today;
        },
        {
          message: "Start date cannot be in the past.",
        }
      ),
    endDate: z.string().min(1, "End date is required"),
    remarks: z
      .string()
      .max(500, "Remarks must be 500 characters or fewer")
      .optional()
      .or(z.literal("")),
  })
  .refine(
    (data) => {
      const start = new Date(data.startDate + "T00:00:00");
      const end = new Date(data.endDate + "T00:00:00");
      return !isNaN(start.getTime()) && !isNaN(end.getTime()) && end >= start;
    },
    {
      message: "End date must be on or after start date.",
      path: ["endDate"],
    }
  );

export type CreateLeaveInput = z.infer<typeof createLeaveSchema>;

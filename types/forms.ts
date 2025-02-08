import { z } from "zod";

const contactFieldSchema = z.object({
  type: z.string().min(1, "Type is required"),
  value: z.string().min(1, "Value is required"),
  isPrimary: z.boolean(),
});

export const repFormSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  middleName: z.string().optional(),
  lastName: z.string().min(1, "Last name is required"),
  fullName: z.string(),
  repType: z.string().min(1, "Rep type is required"),
  isActive: z.boolean().default(true),
  isBranchMgr: z.boolean().default(false),
  dob: z.string().nullable(),
  gender: z.string().nullable(),
  phones: z
    .array(contactFieldSchema)
    .min(1, "At least one phone number is required"),
  emails: z.array(contactFieldSchema).min(1, "At least one email is required"),
  addresses: z
    .array(contactFieldSchema)
    .min(1, "At least one address is required"),
});

export type RepFormValues = z.infer<typeof repFormSchema>;

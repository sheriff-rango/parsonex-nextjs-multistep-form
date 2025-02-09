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

export const clientFormSchema = z.object({
  nameFirst: z.string().min(1, "First name is required"),
  nameMiddle: z.string().optional().default(""),
  nameLast: z.string().min(1, "Last name is required"),
  nameSuffix: z.string().optional().default(""),
  nameSalutation: z.string().optional().default(""),
  nameFull: z.string(),
  dob: z.string().nullable(),
  gender: z.string().nullable(),
  maritalstatus: z.string().nullable(),
  ssnTaxid: z.string().min(1, "SSN/Tax ID is required"),
  employmentStatus: z.string().optional().default(""),
  employmentOccupation: z.string().optional().default(""),
  employer: z.string().optional().default(""),
  employerBusinessType: z.string().optional().default(""),
  isUscitizen: z.boolean().default(false),
  riaClient: z.boolean().default(false),
  bdClient: z.boolean().default(false),
  isActive: z.boolean().default(true),
  phones: z
    .array(contactFieldSchema)
    .min(1, "At least one phone number is required"),
  emails: z.array(contactFieldSchema).min(1, "At least one email is required"),
  addresses: z
    .array(contactFieldSchema)
    .min(1, "At least one address is required"),
  finProfile: z
    .object({
      profileType: z.string().nullable(),
      networth: z.number().nullable(),
      networthLiquid: z.number().nullable(),
      incomeAnnual: z.number().nullable(),
      taxbracket: z.string().nullable(),
      incomeSource: z.string().nullable(),
      investExperience: z.string().nullable(),
      investExperienceYears: z.number().nullable(),
      totalHeldawayAssets: z.number().nullable(),
      incomeSourceType: z.string().nullable(),
      incomeDescription: z.string().nullable(),
      incomeSourceAdditional: z.string().nullable(),
      jointClientId: z.string().nullable(),
    })
    .optional(),
});

export type ClientFormValues = z.infer<typeof clientFormSchema>;

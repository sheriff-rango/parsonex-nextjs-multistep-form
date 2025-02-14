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
  tin: z.string().min(1, "TIN is required"),
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

export const accountFormSchema = z.object({
  accountType: z.string().min(1, "Account type is required"),
  pcm: z.string().min(1, "PCM is required"),
  primaryClientId: z.string().min(1, "Primary client is required"),
  jointClientId: z.string().optional(),
  status: z.string().default("active"),
  openDate: z.string().nullable(),
  closeDate: z.string().nullable(),
  branch: z.string().optional(),
  invObjective: z.string().optional(),
  riskTolerance: z.string().optional(),
  timeHorizon: z.string().optional(),
  date17A3: z.string().nullable(),
  method17A3: z.string().optional(),
});

export type AccountFormValues = z.infer<typeof accountFormSchema>;

export const holdingFormSchema = z.object({
  accountId: z.string().min(1, "Account ID is required"),
  holdingType: z.string().min(1, "Holding type is required"),
  securityName: z.string().min(1, "Security name is required"),
  securityTicker: z.string().optional(),
  cusip: z.string().optional(),
  units: z.number().nullable(),
  unitPrice: z.number().nullable(),
  marketValue: z.number().nullable(),
  costBasis: z.number().nullable(),
  productFamily: z.string().optional(),
  repNo: z.string().optional(),
  holdingFan: z.string().optional(),
  productNo: z.string().optional(),
  branchNo: z.string().optional(),
  holdPriceDate: z.string().nullable(),
});

export type HoldingFormValues = z.infer<typeof holdingFormSchema>;

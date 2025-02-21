import { UseFormReturn } from "react-hook-form";
import { ClientFormValues } from "@/types/forms";
import { FormStep } from "@/components/Forms/form-step";

interface ClientGeneralFormStepProps {
  form: UseFormReturn<ClientFormValues>;
  lists?: {
    profile_types: string[];
    tax_brackets: string[];
    income_sources: string[];
    investment_experience: string[];
    marital_status: string[];
  };
}

export function ClientGeneralFormStep({
  form,
  lists,
}: ClientGeneralFormStepProps) {
  const personalFields = [
    {
      name: "nameFirst",
      label: "First Name",
      type: "text" as const,
      required: true,
    },
    {
      name: "nameMiddle",
      label: "Middle Name",
      type: "text" as const,
    },
    {
      name: "nameLast",
      label: "Last Name",
      type: "text" as const,
      required: true,
    },
    {
      name: "nameSuffix",
      label: "Suffix",
      type: "text" as const,
    },
    {
      name: "nameSalutation",
      label: "Salutation",
      type: "text" as const,
    },
    {
      name: "dob",
      label: "Date of Birth",
      type: "date" as const,
    },
    {
      name: "gender",
      label: "Gender",
      type: "select" as const,
      options: [
        { label: "Male", value: "male" },
        { label: "Female", value: "female" },
      ],
    },
    {
      name: "maritalstatus",
      label: "Marital Status",
      type: "select" as const,
      options: lists?.marital_status.map((status) => ({
        label: status,
        value: status,
      })) || [
        { label: "Single", value: "single" },
        { label: "Married", value: "married" },
        { label: "Divorced", value: "divorced" },
        { label: "Widowed", value: "widowed" },
      ],
    },
    {
      name: "tin",
      label: "TIN",
      type: "text" as const,
      required: true,
    },
  ];

  const employmentFields = [
    {
      name: "employmentStatus",
      label: "Employment Status",
      type: "text" as const,
    },
    {
      name: "employmentOccupation",
      label: "Occupation",
      type: "text" as const,
    },
    {
      name: "employer",
      label: "Employer",
      type: "text" as const,
    },
    {
      name: "employerBusinessType",
      label: "Employer Business Type",
      type: "text" as const,
    },
  ];

  const statusFields = [
    {
      name: "isUscitizen",
      label: "US Citizen",
      type: "checkbox" as const,
    },
    {
      name: "riaClient",
      label: "RIA Client",
      type: "checkbox" as const,
    },
    {
      name: "bdClient",
      label: "BD Client",
      type: "checkbox" as const,
    },
    {
      name: "isActive",
      label: "Active",
      type: "checkbox" as const,
    },
  ];

  const financialProfileFields = [
    {
      name: "finProfile.profileType",
      label: "Profile Type",
      type: "select" as const,
      options:
        lists?.profile_types.map((type) => ({
          label: type,
          value: type,
        })) || [],
    },
    {
      name: "finProfile.networth",
      label: "Net Worth",
      type: "text" as const,
    },
    {
      name: "finProfile.networthLiquid",
      label: "Liquid Net Worth",
      type: "text" as const,
    },
    {
      name: "finProfile.incomeAnnual",
      label: "Annual Income",
      type: "text" as const,
    },
    {
      name: "finProfile.taxbracket",
      label: "Tax Bracket",
      type: "select" as const,
      options:
        lists?.tax_brackets.map((bracket) => ({
          label: bracket,
          value: bracket,
        })) || [],
    },
    {
      name: "finProfile.incomeSource",
      label: "Income Source",
      type: "select" as const,
      options:
        lists?.income_sources.map((source) => ({
          label: source,
          value: source,
        })) || [],
    },
    {
      name: "finProfile.investExperience",
      label: "Investment Experience",
      type: "select" as const,
      options:
        lists?.investment_experience.map((exp) => ({
          label: exp,
          value: exp,
        })) || [],
    },
    {
      name: "finProfile.investExperienceYears",
      label: "Years of Investment Experience",
      type: "text" as const,
    },
    {
      name: "finProfile.totalHeldawayAssets",
      label: "Total Heldaway Assets",
      type: "text" as const,
    },
    {
      name: "finProfile.incomeSourceType",
      label: "Income Source Type",
      type: "text" as const,
    },
    {
      name: "finProfile.incomeDescription",
      label: "Income Description",
      type: "text" as const,
    },
    {
      name: "finProfile.incomeSourceAdditional",
      label: "Additional Income Source",
      type: "text" as const,
    },
  ];

  return (
    <>
      <FormStep
        title="Personal Information"
        fields={personalFields}
        form={form}
      />
      <FormStep
        title="Employment Information"
        fields={employmentFields}
        form={form}
      />
      <FormStep title="Status Information" fields={statusFields} form={form} />
      <FormStep
        title="Financial Profile"
        fields={financialProfileFields}
        form={form}
      />
    </>
  );
}

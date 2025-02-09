import { UseFormReturn } from "react-hook-form";
import { ClientFormValues } from "@/types/forms";
import { FormStep } from "@/components/ui/form-step";

interface ClientGeneralFormStepProps {
  form: UseFormReturn<ClientFormValues>;
}

export function ClientGeneralFormStep({ form }: ClientGeneralFormStepProps) {
  const fields = [
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
      options: [
        { label: "Single", value: "single" },
        { label: "Married", value: "married" },
        { label: "Divorced", value: "divorced" },
        { label: "Widowed", value: "widowed" },
      ],
    },
    {
      name: "ssnTaxid",
      label: "SSN/Tax ID",
      type: "text" as const,
      required: true,
    },
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

  return <FormStep title="General Information" fields={fields} form={form} />;
}

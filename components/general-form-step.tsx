import { UseFormReturn } from "react-hook-form";
import { RepFormValues } from "@/types";
import { FormStep } from "@/components/ui/form-step";

interface GeneralFormStepProps {
  form: UseFormReturn<RepFormValues>;
}

export function GeneralFormStep({ form }: GeneralFormStepProps) {
  const fields = [
    {
      name: "firstName",
      label: "First Name",
      type: "text" as const,
      required: true,
    },
    {
      name: "middleName",
      label: "Middle Name",
      type: "text" as const,
    },
    {
      name: "lastName",
      label: "Last Name",
      type: "text" as const,
      required: true,
    },
    {
      name: "dob",
      label: "Date of Birth",
      type: "date" as const,
    },
    {
      name: "repType",
      label: "Rep Type",
      type: "select" as const,
      required: true,
      options: [
        { label: "Admin", value: "Admin" },
        { label: "Assistant", value: "Assistant" },
        { label: "Back Office", value: "Back Office" },
        { label: "Dual", value: "Dual" },
        { label: "IAR", value: "IAR" },
        { label: "RR", value: "RR" },
        { label: "Unassigned", value: "Unassigned" },
      ],
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
      name: "isActive",
      label: "Active",
      type: "checkbox" as const,
    },
    {
      name: "isBranchMgr",
      label: "Branch Manager",
      type: "checkbox" as const,
    },
  ];

  return <FormStep title="General Information" fields={fields} form={form} />;
}

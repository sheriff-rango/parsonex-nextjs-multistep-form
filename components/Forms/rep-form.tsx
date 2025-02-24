"use client";

import { useActionState } from "@/hooks/use-action-state";
import { createRep, updateRep } from "@/server/actions/reps";
import { RepData, RepFormValues } from "@/types";
import { repFormSchema, TFieldItem } from "@/types/forms";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm, UseFormReturn } from "react-hook-form";
import { toast } from "sonner";
import MultiStepForm from "./multi-step-form";

interface RepFormProps {
  data?: RepData;
}

export function RepForm({ data }: RepFormProps) {
  const router = useRouter();
  const { isLoading, setLoading, setError } = useActionState<RepData>();

  const form = useForm<RepFormValues>({
    resolver: zodResolver(repFormSchema),
    mode: "onChange",
    defaultValues: data || {
      pcm: "",
      firstName: "",
      lastName: "",
      fullName: "",
      repType: "",
      isActive: true,
      isBranchMgr: false,
      dob: null,
      gender: null,
      phones: [{ type: "mobile", value: "", isPrimary: true }],
      emails: [{ type: "work", value: "", isPrimary: true }],
      addresses: [{ type: "home", value: "", isPrimary: true }],
    },
  });

  const defaultValues = data || {
    pcm: "",
    firstName: "",
    lastName: "",
    fullName: "",
    repType: "",
    isActive: true,
    isBranchMgr: false,
    dob: null,
    gender: null,
  };

  const subscriptionCallback =
    (form: UseFormReturn) =>
    (value: any, { name }: any) => {
      if (name?.match(/^(firstName|lastName)$/)) {
        const { firstName, lastName } = value;
        const fullName = [firstName, lastName].filter(Boolean).join(" ");
        form.setValue("fullName", fullName);
      }
    };

  async function onSubmit(values: RepFormValues) {
    setLoading(true);

    try {
      if (data) {
        await updateRep(values);
        toast.success("Rep updated successfully");
      } else {
        await createRep(values);
        toast.success("Rep created successfully");
      }
      router.push("/dashboard/reps");
      router.refresh();
    } catch (error) {
      console.error(error);
      setError(error instanceof Error ? error.message : "Unknown error");
      toast.error(error instanceof Error ? error.message : "Unknown error");
    }
  }

  const genrealInformationFields = [
    {
      name: "pcm",
      label: "PCM",
      type: TFieldItem.TEXT,
      required: true,
    },
    {
      name: "firstName",
      label: "First Name",
      type: TFieldItem.TEXT,
      required: true,
    },
    {
      name: "lastName",
      label: "Last Name",
      type: TFieldItem.TEXT,
      required: true,
    },
    {
      name: "dob",
      label: "Date of Birth",
      type: TFieldItem.DATE,
    },
    {
      name: "repType",
      label: "Rep Type",
      type: TFieldItem.SELECT,
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
      type: TFieldItem.SELECT,
      options: [
        { label: "Male", value: "male" },
        { label: "Female", value: "female" },
      ],
    },
    {
      name: "isActive",
      label: "Active",
      type: TFieldItem.CHECKBOX,
      isFullWidth: true,
    },
    {
      name: "isBranchMgr",
      label: "Branch Manager",
      type: TFieldItem.CHECKBOX,
      isFullWidth: true,
    },
  ];

  return (
    <MultiStepForm
      isLoading={isLoading}
      defaultValues={defaultValues}
      options={[
        {
          title: "General Inforamtion",
          fields: genrealInformationFields,
        },
      ]}
      subscriptionCallback={subscriptionCallback}
      resolver={repFormSchema}
      events={{
        onSubmit,
      }}
    />
  );
}

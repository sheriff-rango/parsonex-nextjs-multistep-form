"use client";

import { useActionState } from "@/hooks/use-action-state";
import { createClient, updateClient } from "@/server/actions/clients";
import { ClientData } from "@/types";
import { clientFormSchema, ClientFormValues, TFieldItem } from "@/types/forms";
import { useRouter } from "next/navigation";
import { UseFormReturn } from "react-hook-form";
import { toast } from "sonner";
import MultiStepForm from "./multi-step-form";

interface ClientFormProps {
  data?: ClientData;
  clientId?: string;
}

export function ClientForm({ data, clientId }: ClientFormProps) {
  const router = useRouter();
  const { isLoading, setLoading, setError } = useActionState<ClientData>();

  const defaultValues = data || {
    nameFirst: "",
    nameMiddle: "",
    nameLast: "",
    nameSuffix: "",
    nameSalutation: "",
    nameFull: "",
    dob: null,
    gender: null,
    maritalstatus: null,
    tin: "",
    employmentStatus: "",
    employmentOccupation: "",
    employer: "",
    employerBusinessType: "",
    isUscitizen: false,
    riaClient: false,
    bdClient: false,
    isActive: true,
    finProfile: {
      profileType: null,
      networth: null,
      networthLiquid: null,
      incomeAnnual: null,
      taxbracket: null,
      incomeSource: null,
      investExperience: null,
      investExperienceYears: null,
      totalHeldawayAssets: null,
      incomeSourceType: null,
      incomeDescription: null,
      incomeSourceAdditional: null,
      jointClientId: null,
    },
  };

  const subscriptionCallback =
    (form: UseFormReturn) =>
    (value: any, { name }: any) => {
      if (name?.match(/^(nameFirst|nameMiddle|nameLast|nameSuffix)$/)) {
        const { nameFirst, nameMiddle, nameLast, nameSuffix } = value;
        const nameFull = [nameFirst, nameMiddle, nameLast, nameSuffix]
          .filter(Boolean)
          .join(" ");
        form.setValue("nameFull", nameFull);
      }
    };

  async function onSubmit(values: ClientFormValues) {
    setLoading(true);

    try {
      const formattedValues: ClientData = {
        ...values,
        nameFirst: values.nameFirst || "",
        nameMiddle: values.nameMiddle || "",
        nameLast: values.nameLast || "",
        nameSuffix: values.nameSuffix || "",
        nameSalutation: values.nameSalutation || "",
        nameFull: values.nameFull || "",
        employmentStatus: values.employmentStatus || "",
        employmentOccupation: values.employmentOccupation || "",
        employer: values.employer || "",
        employerBusinessType: values.employerBusinessType || "",
      };

      if (clientId) {
        await updateClient(clientId, formattedValues);
        toast.success("Client updated successfully");
      } else {
        await createClient(formattedValues);
        toast.success("Client created successfully");
      }
      router.push("/dashboard/clients");
      router.refresh();
    } catch (error) {
      console.error(error);
      setError(error instanceof Error ? error.message : "Unknown error");
      toast.error(error instanceof Error ? error.message : "Unknown error");
    }
  }

  const personalFields = [
    {
      name: "nameFirst",
      label: "First Name",
      type: TFieldItem.TEXT,
      required: true,
    },
    {
      name: "nameMiddle",
      label: "Middle Name",
      type: TFieldItem.TEXT,
    },
    {
      name: "nameLast",
      label: "Last Name",
      type: TFieldItem.TEXT,
      required: true,
    },
    {
      name: "nameSuffix",
      label: "Suffix",
      type: TFieldItem.TEXT,
    },
    {
      name: "nameSalutation",
      label: "Salutation",
      type: TFieldItem.TEXT,
    },
    {
      name: "dob",
      label: "Date of Birth",
      type: TFieldItem.DATE,
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
      name: "maritalstatus",
      label: "Marital Status",
      type: TFieldItem.SELECT,
      options: [
        { label: "Single", value: "single" },
        { label: "Married", value: "married" },
        { label: "Divorced", value: "divorced" },
        { label: "Widowed", value: "widowed" },
      ],
    },
    {
      name: "tin",
      label: "TIN",
      type: TFieldItem.TEXT,
      required: true,
    },
  ];

  const employmentFields = [
    {
      name: "employmentStatus",
      label: "Employment Status",
      type: TFieldItem.TEXT,
    },
    {
      name: "employmentOccupation",
      label: "Occupation",
      type: TFieldItem.TEXT,
    },
    {
      name: "employer",
      label: "Employer",
      type: TFieldItem.TEXT,
    },
    {
      name: "employerBusinessType",
      label: "Employer Business Type",
      type: TFieldItem.TEXT,
    },
  ];

  const statusFields = [
    {
      name: "isUscitizen",
      label: "US Citizen",
      type: TFieldItem.CHECKBOX,
    },
    {
      name: "riaClient",
      label: "RIA Client",
      type: TFieldItem.CHECKBOX,
    },
    {
      name: "bdClient",
      label: "BD Client",
      type: TFieldItem.CHECKBOX,
    },
    {
      name: "isActive",
      label: "Active",
      type: TFieldItem.CHECKBOX,
    },
  ];

  const financialProfileFields = [
    {
      name: "finProfile.profileType",
      label: "Profile Type",
      type: TFieldItem.SELECT,
      options: [],
    },
    {
      name: "finProfile.networth",
      label: "Net Worth",
      type: TFieldItem.NUMBER,
    },
    {
      name: "finProfile.networthLiquid",
      label: "Liquid Net Worth",
      type: TFieldItem.NUMBER,
    },
    {
      name: "finProfile.incomeAnnual",
      label: "Annual Income",
      type: TFieldItem.NUMBER,
    },
    {
      name: "finProfile.taxbracket",
      label: "Tax Bracket",
      type: TFieldItem.SELECT,
      options: [],
    },
    {
      name: "finProfile.incomeSource",
      label: "Income Source",
      type: TFieldItem.SELECT,
      options: [],
    },
    {
      name: "finProfile.investExperience",
      label: "Investment Experience",
      type: TFieldItem.SELECT,
      options: [],
    },
    {
      name: "finProfile.investExperienceYears",
      label: "Years of Investment Experience",
      type: TFieldItem.NUMBER,
    },
    {
      name: "finProfile.totalHeldawayAssets",
      label: "Total Heldaway Assets",
      type: TFieldItem.NUMBER,
    },
    {
      name: "finProfile.incomeSourceType",
      label: "Income Source Type",
      type: TFieldItem.TEXT,
    },
    {
      name: "finProfile.incomeDescription",
      label: "Income Description",
      type: TFieldItem.TEXT,
    },
    {
      name: "finProfile.incomeSourceAdditional",
      label: "Additional Income Source",
      type: TFieldItem.TEXT,
    },
  ];

  return (
    <MultiStepForm
      isLoading={isLoading}
      defaultValues={defaultValues}
      options={[
        {
          title: "Personal Information",
          fields: personalFields,
        },
        {
          title: "Employment Information",
          fields: employmentFields,
        },
        {
          title: "Status Information",
          fields: statusFields,
          gridCols: 1,
        },
        {
          title: "Financial Profile",
          fields: financialProfileFields,
        },
      ]}
      subscriptionCallback={subscriptionCallback}
      resolver={clientFormSchema}
      events={{
        onSubmit,
      }}
    />
  );
}

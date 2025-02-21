"use client";

import { useActionState } from "@/hooks/use-action-state";
import { createAccount, updateAccount } from "@/server/actions/accounts";
import { AccountFormValues } from "@/types";
import { accountFormSchema, TFieldItem } from "@/types/forms";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import MultiStepForm from "./multi-step-form";

interface AccountFormProps {
  data?: AccountFormValues;
  accountId?: string;
  lists: {
    account_types: string[];
    marital_status: string[];
    risk_tolerance: string[];
    time_horizon: string[];
    investment_objectives: string[];
  };
}

const timeHorizonOrder = [
  "Under 3 Years",
  "3-5 Years",
  "6-10 Years",
  "11-20 Years",
  "20+ Years",
];

export function AccountForm({ data, accountId, lists }: AccountFormProps) {
  const router = useRouter();
  const { isLoading, setLoading, setError } = useActionState();

  const defaultValues = data || {
    accountType: "",
    status: "active",
    openDate: null,
    closeDate: null,
    primaryClientId: "",
    jointClientId: "",
    branch: "",
    pcm: "",
    invObjective: "",
    riskTolerance: "",
    timeHorizon: "",
    date17A3: null,
    method17A3: "",
  };

  async function onSubmit(values: AccountFormValues) {
    setLoading(true);

    try {
      if (accountId) {
        await updateAccount(accountId, values);
        toast.success("Account updated successfully");
      } else {
        const { success } = await createAccount(values);
        if (success) {
          toast.success("Account created successfully");
          router.push("/dashboard/accounts");
        } else {
          toast.error("Failed to create account");
        }
      }
      router.push("/dashboard/accounts");
      router.refresh();
    } catch (error) {
      console.error("Detailed error:", error);
      setError(error instanceof Error ? error.message : "Unknown error");
      toast.error(error instanceof Error ? error.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  const accountFields = [
    {
      name: "accountType",
      label: "Account Type",
      type: TFieldItem.SELECT,
      required: true,
      options: lists.account_types.map((type) => ({
        label: type,
        value: type,
      })),
    },
    {
      name: "pcm",
      label: "PCM",
      type: TFieldItem.TEXT,
      required: true,
    },
    {
      name: "primaryClientId",
      label: "Primary Client Id",
      type: TFieldItem.TEXT,
      required: true,
    },
    {
      name: "jointClientId",
      label: "Joint Client Id",
      type: TFieldItem.TEXT,
    },
    {
      name: "branch",
      label: "Branch",
      type: TFieldItem.TEXT,
    },
    {
      name: "openDate",
      label: "Open Date",
      type: TFieldItem.DATE,
    },
  ];

  const investmentFields = [
    {
      name: "invObjective",
      label: "Investment Objective",
      type: TFieldItem.SELECT,
      options: lists.investment_objectives.map((objective) => ({
        label: objective,
        value: objective,
      })),
    },
    {
      name: "riskTolerance",
      label: "Risk Tolerance",
      type: TFieldItem.SELECT,
      options: lists.risk_tolerance.map((tolerance) => ({
        label: tolerance,
        value: tolerance,
      })),
    },
    {
      name: "timeHorizon",
      label: "Time Horizon",
      type: TFieldItem.SELECT,
      options: lists.time_horizon
        .sort(
          (a, b) => timeHorizonOrder.indexOf(a) - timeHorizonOrder.indexOf(b),
        )
        .map((horizon) => ({
          label: horizon,
          value: horizon,
        })),
    },
  ];

  const regulatoryFields = [
    {
      name: "date17A3",
      label: "17A3 Date",
      type: TFieldItem.DATE,
    },
    {
      name: "method17A3",
      label: "17A3 Method",
      type: TFieldItem.SELECT,
      options: [
        { label: "Email", value: "email" },
        { label: "Mail", value: "mail" },
        { label: "In Person", value: "in_person" },
      ],
    },
  ];

  return (
    <MultiStepForm
      isLoading={isLoading}
      defaultValues={defaultValues}
      options={[
        {
          title: "Account Information",
          fields: accountFields,
        },
        {
          title: "Investment Profile",
          fields: investmentFields,
        },
        {
          title: "Regulatory Information",
          fields: regulatoryFields,
        },
      ]}
      resolver={accountFormSchema}
      events={{
        onSubmit,
      }}
    />
  );
}

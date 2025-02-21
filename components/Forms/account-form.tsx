"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { AccountFormValues } from "@/types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { useActionState } from "@/hooks/use-action-state";
import { FormStep } from "@/components/Forms/form-step";
import { accountFormSchema } from "@/types/forms";
import { createAccount, updateAccount } from "@/server/actions/accounts";

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

  const form = useForm<AccountFormValues>({
    resolver: zodResolver(accountFormSchema),
    mode: "onChange",
    defaultValues: data || {
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
    },
  });

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
      type: "select" as const,
      required: true,
      options: lists.account_types.map((type) => ({
        label: type,
        value: type,
      })),
    },
    {
      name: "pcm",
      label: "PCM",
      type: "text" as const,
      required: true,
    },
    {
      name: "primaryClientId",
      label: "Primary Client Id",
      type: "text" as const,
      required: true,
    },
    {
      name: "jointClientId",
      label: "Joint Client Id",
      type: "text" as const,
    },
    {
      name: "branch",
      label: "Branch",
      type: "text" as const,
    },
    {
      name: "openDate",
      label: "Open Date",
      type: "date" as const,
    },
  ];

  const investmentFields = [
    {
      name: "invObjective",
      label: "Investment Objective",
      type: "select" as const,
      options: lists.investment_objectives.map((objective) => ({
        label: objective,
        value: objective,
      })),
    },
    {
      name: "riskTolerance",
      label: "Risk Tolerance",
      type: "select" as const,
      options: lists.risk_tolerance.map((tolerance) => ({
        label: tolerance,
        value: tolerance,
      })),
    },
    {
      name: "timeHorizon",
      label: "Time Horizon",
      type: "select" as const,
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
      type: "date" as const,
    },
    {
      name: "method17A3",
      label: "17A3 Method",
      type: "select" as const,
      options: [
        { label: "Email", value: "email" },
        { label: "Mail", value: "mail" },
        { label: "In Person", value: "in_person" },
      ],
    },
  ];

  return (
    <Card className="mt-4 pt-4">
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormStep
              title="Account Information"
              fields={accountFields}
              form={form}
            />
            <FormStep
              title="Investment Profile"
              fields={investmentFields}
              form={form}
            />
            <FormStep
              title="Regulatory Information"
              fields={regulatoryFields}
              form={form}
            />
            <div className="flex justify-end">
              <Button type="submit" disabled={isLoading}>
                {accountId
                  ? isLoading
                    ? "Updating..."
                    : "Update Account"
                  : isLoading
                    ? "Creating..."
                    : "Create Account"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

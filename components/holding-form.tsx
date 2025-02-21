"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { HoldingFormValues } from "@/types/forms";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { useActionState } from "@/hooks/use-action-state";
import { FormStep } from "@/components/Forms/form-step";
import { holdingFormSchema } from "@/types/forms";
import { createHolding, updateHolding } from "@/server/actions/holdings";

interface HoldingFormProps {
  data?: HoldingFormValues;
  holdingId?: string;
  accountId?: string;
}

export function HoldingForm({ data, holdingId, accountId }: HoldingFormProps) {
  const router = useRouter();
  const { isLoading, setLoading, setError } = useActionState();

  const form = useForm<HoldingFormValues>({
    resolver: zodResolver(holdingFormSchema),
    mode: "onChange",
    defaultValues: data || {
      accountId: accountId || "",
      holdingType: "",
      securityName: "",
      securityTicker: "",
      cusip: "",
      units: null,
      unitPrice: null,
      marketValue: null,
      costBasis: null,
      productFamily: "",
      repNo: "",
      holdingFan: "",
      productNo: "",
      branchNo: "",
      holdPriceDate: null,
    },
  });

  async function onSubmit(values: HoldingFormValues) {
    setLoading(true);

    try {
      if (holdingId) {
        await updateHolding(holdingId, values);
        toast.success("Holding updated successfully");
      } else {
        await createHolding(values);
        toast.success("Holding created successfully");
      }
      router.push(`/dashboard/holdings`);
      router.refresh();
    } catch (error) {
      console.error("Detailed error:", error);
      setError(error instanceof Error ? error.message : "Unknown error");
      toast.error(error instanceof Error ? error.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  const holdingFields = [
    {
      name: "accountId",
      label: "Account ID",
      type: "text" as const,
      required: true,
      disabled: Boolean(accountId),
    },
    {
      name: "holdingType",
      label: "Holding Type",
      type: "select" as const,
      required: true,
      options: [
        { label: "Equity", value: "equity" },
        { label: "Fixed Income", value: "fixed_income" },
        { label: "Mutual Fund", value: "mutual_fund" },
        { label: "ETF", value: "etf" },
        { label: "Option", value: "option" },
        { label: "Other", value: "other" },
      ],
    },
    {
      name: "securityName",
      label: "Security Name",
      type: "text" as const,
      required: true,
    },
    {
      name: "securityTicker",
      label: "Security Ticker",
      type: "text" as const,
    },
    {
      name: "cusip",
      label: "CUSIP",
      type: "text" as const,
    },
  ];

  const valueFields = [
    {
      name: "units",
      label: "Units",
      type: "text" as const,
    },
    {
      name: "unitPrice",
      label: "Unit Price",
      type: "text" as const,
    },
    {
      name: "marketValue",
      label: "Market Value",
      type: "text" as const,
    },
    {
      name: "costBasis",
      label: "Cost Basis",
      type: "text" as const,
    },
    {
      name: "holdPriceDate",
      label: "Price Date",
      type: "date" as const,
    },
  ];

  const additionalFields = [
    {
      name: "productFamily",
      label: "Product Family",
      type: "text" as const,
    },
    {
      name: "productNo",
      label: "Product Number",
      type: "text" as const,
    },
    {
      name: "holdingFan",
      label: "Holding FAN",
      type: "text" as const,
    },
    {
      name: "branchNo",
      label: "Branch Number",
      type: "text" as const,
    },
    {
      name: "repNo",
      label: "Rep Number",
      type: "text" as const,
    },
  ];

  return (
    <Card className="mt-4 pt-4">
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormStep
              title="Holding Information"
              fields={holdingFields}
              form={form}
            />
            <FormStep
              title="Value Information"
              fields={valueFields}
              form={form}
            />
            <FormStep
              title="Additional Information"
              fields={additionalFields}
              form={form}
            />
            <div className="flex justify-end">
              <Button type="submit" disabled={isLoading}>
                {holdingId
                  ? isLoading
                    ? "Updating..."
                    : "Update Holding"
                  : isLoading
                    ? "Creating..."
                    : "Create Holding"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

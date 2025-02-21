"use client";

import { useActionState } from "@/hooks/use-action-state";
import { createHolding, updateHolding } from "@/server/actions/holdings";
import {
  holdingFormSchema,
  HoldingFormValues,
  TFieldItem,
} from "@/types/forms";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import MultiStepForm from "./multi-step-form";

interface HoldingFormProps {
  data?: HoldingFormValues;
  holdingId?: string;
  accountId?: string;
}

export function HoldingForm({ data, holdingId, accountId }: HoldingFormProps) {
  const router = useRouter();
  const { isLoading, setLoading, setError } = useActionState();

  const defaultValues = data || {
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
  };

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
      type: TFieldItem.TEXT,
      required: true,
      disabled: Boolean(accountId),
    },
    {
      name: "holdingType",
      label: "Holding Type",
      type: TFieldItem.SELECT,
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
      type: TFieldItem.TEXT,
      required: true,
    },
    {
      name: "securityTicker",
      label: "Security Ticker",
      type: TFieldItem.TEXT,
    },
    {
      name: "cusip",
      label: "CUSIP",
      type: TFieldItem.TEXT,
    },
  ];

  const valueFields = [
    {
      name: "units",
      label: "Units",
      type: TFieldItem.NUMBER,
    },
    {
      name: "unitPrice",
      label: "Unit Price",
      type: TFieldItem.NUMBER,
    },
    {
      name: "marketValue",
      label: "Market Value",
      type: TFieldItem.NUMBER,
    },
    {
      name: "costBasis",
      label: "Cost Basis",
      type: TFieldItem.NUMBER,
    },
    {
      name: "holdPriceDate",
      label: "Price Date",
      type: TFieldItem.DATE,
    },
  ];

  const additionalFields = [
    {
      name: "productFamily",
      label: "Product Family",
      type: TFieldItem.TEXT,
    },
    {
      name: "productNo",
      label: "Product Number",
      type: TFieldItem.TEXT,
    },
    {
      name: "holdingFan",
      label: "Holding FAN",
      type: TFieldItem.TEXT,
    },
    {
      name: "branchNo",
      label: "Branch Number",
      type: TFieldItem.TEXT,
    },
    {
      name: "repNo",
      label: "Rep Number",
      type: TFieldItem.TEXT,
    },
  ];

  return (
    <MultiStepForm
      isLoading={isLoading}
      defaultValues={defaultValues}
      options={[
        {
          title: "Holding Information",
          fields: holdingFields,
        },
        {
          title: "Value Information",
          fields: valueFields,
        },
        {
          title: "Additional Information",
          fields: additionalFields,
        },
      ]}
      resolver={holdingFormSchema}
      events={{
        onSubmit,
      }}
    />
  );
}

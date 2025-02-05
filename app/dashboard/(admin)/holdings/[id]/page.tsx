import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { H1, H2 } from "@/components/typography";
import { getHolding } from "@/server/actions/holdings";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface HoldingProfilePageProps {
  params: {
    id: string;
  };
}

export default async function HoldingProfilePage({
  params,
}: HoldingProfilePageProps) {
  const { id } = params;
  const decodedId = decodeURIComponent(id);

  const holding = await getHolding(decodedId);

  if (!holding) {
    return <div>Holding not found</div>;
  }

  const holdingFields = [
    { label: "Security Name", value: holding.securityName || "N/A" },
    { label: "Security Ticker", value: holding.securityTicker || "N/A" },
    { label: "CUSIP", value: holding.cusip || "N/A" },
    {
      label: "Units",
      value:
        holding.units?.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }) || "N/A",
    },
    {
      label: "Unit Price",
      value:
        holding.unitPrice?.toLocaleString(undefined, {
          style: "currency",
          currency: "USD",
        }) || "N/A",
    },
    {
      label: "Market Value",
      value:
        holding.marketValue?.toLocaleString(undefined, {
          style: "currency",
          currency: "USD",
        }) || "N/A",
    },
    {
      label: "Cost Basis",
      value:
        holding.costBasis?.toLocaleString(undefined, {
          style: "currency",
          currency: "USD",
        }) || "N/A",
    },
    { label: "Holding Type", value: holding.holdingType || "N/A" },
    { label: "Product Family", value: holding.productFamily || "N/A" },
  ];

  return (
    <div className="p-4 outline-none">
      <div className="flex items-center justify-between">
        <H1>{holding.securityName}</H1>
        <Link href={`/dashboard/accounts/${holding.accountId}`}>
          <Button variant="outline">Back to Account</Button>
        </Link>
      </div>

      <div className="mt-4">
        <Card>
          <CardHeader>
            <H2>Holding Details</H2>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {holdingFields.map((field) => (
                <div key={field.label} className="flex items-center gap-2">
                  <div className="w-1/2 font-semibold">{field.label}:</div>
                  <div>{field.value}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

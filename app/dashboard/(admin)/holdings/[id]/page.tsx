import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { H1, H2 } from "@/components/typography";
import { getHolding } from "@/server/actions/holdings";
import { HoldingMenu } from "@/components/holding-menu";
import { Button } from "@/components/ui/button";
import Link from "next/link";

type Params = Promise<{ id: string }>;

export default async function HoldingPage({ params }: { params: Params }) {
  const { id } = await params;
  const holding = await getHolding(id);

  if (!holding) {
    return <div>Holding not found</div>;
  }

  const holdingFields = [
    { label: "Security Name", value: holding.securityName || "N/A" },
    { label: "Security Ticker", value: holding.securityTicker || "N/A" },
    { label: "Holding Type", value: holding.holdingType || "N/A" },
    { label: "CUSIP", value: holding.cusip || "N/A" },
    { label: "Units", value: holding.units?.toString() || "N/A" },
    { label: "Unit Price", value: holding.unitPrice?.toString() || "N/A" },
    { label: "Market Value", value: holding.marketValue?.toString() || "N/A" },
    { label: "Cost Basis", value: holding.costBasis?.toString() || "N/A" },
  ];

  const additionalFields = [
    { label: "Product Family", value: holding.productFamily || "N/A" },
    { label: "Product Number", value: holding.productNo || "N/A" },
    { label: "Holding FAN", value: holding.holdingFan || "N/A" },
    { label: "Branch Number", value: holding.branchNo || "N/A" },
    { label: "Rep Number", value: holding.repNo || "N/A" },
    {
      label: "Price Date",
      value: holding.holdPriceDate
        ? new Date(holding.holdPriceDate).toLocaleDateString()
        : "N/A",
    },
    {
      label: "Last Updated",
      value: holding.lastUpdated
        ? new Date(holding.lastUpdated).toLocaleDateString()
        : "N/A",
    },
    {
      label: "Created On",
      value: holding.createdOn
        ? new Date(holding.createdOn).toLocaleDateString()
        : "N/A",
    },
  ];

  return (
    <div className="p-4 outline-none">
      <div className="flex items-center justify-between">
        <div>
          <H1>{holding.securityName || holding.holdingId}</H1>
          <div className="text-sm text-muted-foreground">
            {holding.securityTicker}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link href={`/dashboard/accounts/${holding.accountId}`}>
            <Button variant="outline">Back to Account</Button>
          </Link>
          <HoldingMenu holding={holding} />
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <H2>Holding Details</H2>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {holdingFields.map((field) => (
                <div key={field.label} className="flex items-center gap-2">
                  <div className="w-1/2 font-semibold">{field.label}:</div>
                  <div>{field.value}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <H2>Additional Information</H2>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {additionalFields.map((field) => (
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

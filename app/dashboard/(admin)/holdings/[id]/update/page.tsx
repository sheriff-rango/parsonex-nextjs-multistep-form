import { getHolding } from "@/server/actions/holdings";
import { HoldingForm } from "@/components/holding-form";
import { H1 } from "@/components/typography";
import { HoldingFormValues } from "@/types/forms";

type Params = Promise<{ id: string }>;

export default async function UpdateHoldingPage({
  params,
}: {
  params: Params;
}) {
  const { id } = await params;
  const holding = await getHolding(id);

  if (!holding) {
    return <div>Holding not found</div>;
  }

  const formData: HoldingFormValues = {
    accountId: holding.accountId,
    holdingType: holding.holdingType,
    securityName: holding.securityName || "",
    securityTicker: holding.securityTicker || "",
    cusip: holding.cusip || "",
    units: holding.units,
    unitPrice: holding.unitPrice,
    marketValue: holding.marketValue,
    costBasis: holding.costBasis,
    productFamily: holding.productFamily || "",
    repNo: holding.repNo || "",
    holdingFan: holding.holdingFan || "",
    productNo: holding.productNo || "",
    branchNo: holding.branchNo || "",
    holdPriceDate: holding.holdPriceDate || null,
  };

  return (
    <div className="flex h-full flex-col p-4">
      <H1>Update Holding</H1>
      <HoldingForm data={formData} holdingId={id} />
    </div>
  );
}

"use server";

import { db } from "@/server/db";
import { psiHoldings } from "@/server/db/schema";

export type Holding = {
  holdingId: string;
  accountId: string;
  holdingType: string;
  securityName: string | null;
  securityTicker: string | null;
  cusip: string | null;
  units: number | null;
  unitPrice: number | null;
  marketValue: number | null;
  costBasis: number | null;
  productFamily: string | null;
  repNo: string | null;
};

export async function getHoldings(): Promise<Holding[]> {
  const result = await db
    .select({
      holdingId: psiHoldings.holdingId,
      accountId: psiHoldings.accountId,
      holdingType: psiHoldings.holdingType,
      securityName: psiHoldings.securityName,
      securityTicker: psiHoldings.securityTicker,
      cusip: psiHoldings.cusip,
      units: psiHoldings.units,
      unitPrice: psiHoldings.unitPrice,
      marketValue: psiHoldings.marketValue,
      costBasis: psiHoldings.costBasis,
      productFamily: psiHoldings.productFamily,
      repNo: psiHoldings.repNo,
    })
    .from(psiHoldings)
    .orderBy(psiHoldings.holdingId);

  return result.map((holding) => ({
    ...holding,
    units: holding.units ? Number(holding.units) : null,
    unitPrice: holding.unitPrice ? Number(holding.unitPrice) : null,
    marketValue: holding.marketValue ? Number(holding.marketValue) : null,
    costBasis: holding.costBasis ? Number(holding.costBasis) : null,
  }));
}

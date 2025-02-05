"use server";

import { db } from "@/server/db";
import { psiHoldings } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { checkAdmin } from "@/server/server-only/auth";
import { Holding } from "@/types";

export async function getHolding(holdingId: string): Promise<Holding | null> {
  try {
    if (!checkAdmin()) {
      throw new Error("Unauthorized access");
    }

    const [holding] = await db
      .select()
      .from(psiHoldings)
      .where(eq(psiHoldings.holdingId, holdingId));

    if (!holding) {
      console.log("No holding found with ID:", holdingId);
      throw new Error("No holding found with ID");
    }

    return {
      ...holding,
      units: holding.units ? Number(holding.units) : null,
      unitPrice: holding.unitPrice ? Number(holding.unitPrice) : null,
      marketValue: holding.marketValue ? Number(holding.marketValue) : null,
      costBasis: holding.costBasis ? Number(holding.costBasis) : null,
    };
  } catch (error) {
    console.error("Error fetching holding:", error);
    return null;
  }
}

export async function getHoldings(): Promise<Holding[] | null> {
  try {
    if (!checkAdmin()) {
      throw new Error("Unauthorized access");
    }

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
        holdingFan: psiHoldings.holdingFan,
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
  } catch (error) {
    console.error("Error fetching holdings:", error);
    return null;
  }
}

"use server";

import { db } from "@/server/db";
import { psiHoldings } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { checkAdmin } from "@/server/server-only/auth";
import { Holding } from "@/types";
import { HoldingFormValues } from "@/types/forms";
import { revalidatePath } from "next/cache";

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
      return null;
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
        lastUpdated: psiHoldings.lastUpdated,
        createdOn: psiHoldings.createdOn,
        holdingFan: psiHoldings.holdingFan,
        productNo: psiHoldings.productNo,
        productFamily: psiHoldings.productFamily,
        holdPriceDate: psiHoldings.holdPriceDate,
        branchNo: psiHoldings.branchNo,
        repNo: psiHoldings.repNo,
      })
      .from(psiHoldings)
      .orderBy(psiHoldings.securityName);

    return result
      .filter((holding) => holding.securityName?.trim() !== "")
      .map((holding) => ({
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

export async function createHolding(data: HoldingFormValues) {
  try {
    if (!checkAdmin()) {
      throw new Error("Unauthorized access");
    }

    await db.insert(psiHoldings).values({
      accountId: data.accountId,
      holdingType: data.holdingType,
      securityName: data.securityName,
      securityTicker: data.securityTicker || null,
      cusip: data.cusip || null,
      units: data.units?.toString() || null,
      unitPrice: data.unitPrice?.toString() || null,
      marketValue: data.marketValue?.toString() || null,
      costBasis: data.costBasis?.toString() || null,
      productFamily: data.productFamily || null,
      repNo: data.repNo || null,
      holdingFan: data.holdingFan || null,
      productNo: data.productNo || null,
      branchNo: data.branchNo || null,
      holdPriceDate: data.holdPriceDate || null,
    });

    revalidatePath("/dashboard/accounts");
    return { success: true };
  } catch (error) {
    console.error("Error creating holding:", error);
    throw new Error("Failed to create holding");
  }
}

export async function updateHolding(
  holdingId: string,
  data: HoldingFormValues,
) {
  try {
    if (!checkAdmin()) {
      throw new Error("Unauthorized access");
    }

    await db
      .update(psiHoldings)
      .set({
        accountId: data.accountId,
        holdingType: data.holdingType,
        securityName: data.securityName,
        securityTicker: data.securityTicker || null,
        cusip: data.cusip || null,
        units: data.units?.toString() || null,
        unitPrice: data.unitPrice?.toString() || null,
        marketValue: data.marketValue?.toString() || null,
        costBasis: data.costBasis?.toString() || null,
        productFamily: data.productFamily || null,
        repNo: data.repNo || null,
        holdingFan: data.holdingFan || null,
        productNo: data.productNo || null,
        branchNo: data.branchNo || null,
        holdPriceDate: data.holdPriceDate || null,
      })
      .where(eq(psiHoldings.holdingId, holdingId));

    revalidatePath("/dashboard/accounts");
  } catch (error) {
    console.error("Error updating holding:", error);
    throw new Error("Failed to update holding");
  }
}

export async function deleteHolding(holdingId: string) {
  try {
    if (!checkAdmin()) {
      throw new Error("Unauthorized access");
    }

    await db.delete(psiHoldings).where(eq(psiHoldings.holdingId, holdingId));

    revalidatePath("/dashboard/accounts");
  } catch (error) {
    console.error("Error deleting holding:", error);
    throw new Error("Failed to delete holding");
  }
}

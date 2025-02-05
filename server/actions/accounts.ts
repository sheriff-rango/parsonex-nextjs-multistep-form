"use server";

import { db } from "@/server/db";
import { psiAccounts, psiHoldings } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { checkAdmin } from "@/server/server-only/auth";
import { Account, Holding } from "@/types";

export async function getAccounts(): Promise<Account[] | null> {
  if (!checkAdmin()) {
    return null;
  }

  const result = await db
    .select()
    .from(psiAccounts)
    .orderBy(psiAccounts.searchid);

  return result;
}

export async function getAccountsByPCM(pcm: string): Promise<Account[] | null> {
  if (!checkAdmin()) {
    return null;
  }

  const result = await db
    .select()
    .from(psiAccounts)
    .where(eq(psiAccounts.pcm, pcm));

  return result;
}

export async function getAccountProfile(
  accountId: string,
): Promise<Account | null> {
  if (!checkAdmin()) {
    return null;
  }

  try {
    const [account] = await db
      .select()
      .from(psiAccounts)
      .where(eq(psiAccounts.accountId, accountId));

    if (!account) {
      console.log("No account found with ID:", accountId);
      return null;
    }

    return account;
  } catch (error) {
    console.error("Error fetching account profile:", error);
    throw error;
  }
}

export async function getAccountHoldings(
  accountId: string,
): Promise<Holding[] | null> {
  if (!checkAdmin()) {
    return null;
  }

  try {
    const holdings = await db
      .select()
      .from(psiHoldings)
      .where(eq(psiHoldings.accountId, accountId))
      .orderBy(psiHoldings.securityName);

    return holdings.map((holding) => ({
      ...holding,
      units: holding.units ? Number(holding.units) : null,
      unitPrice: holding.unitPrice ? Number(holding.unitPrice) : null,
      marketValue: holding.marketValue ? Number(holding.marketValue) : null,
      costBasis: holding.costBasis ? Number(holding.costBasis) : null,
    }));
  } catch (error) {
    console.error("Error fetching account holdings:", error);
    throw error;
  }
}

"use server";

import { db } from "@/server/db";
import { psiAccounts, psiHoldings } from "@/server/db/schema";
import { eq } from "drizzle-orm";

export type Account = {
  accountId: string;
  searchid: string | null;
  accountType: string | null;
  status: string | null;
  pcm: string | null;
  branch: string | null;
  accountEmail: string | null;
};

export async function getAccounts(): Promise<Account[]> {
  const result = await db
    .select({
      accountId: psiAccounts.accountId,
      searchid: psiAccounts.searchid,
      accountType: psiAccounts.accountType,
      status: psiAccounts.status,
      pcm: psiAccounts.pcm,
      branch: psiAccounts.branch,
      accountEmail: psiAccounts.accountEmail,
    })
    .from(psiAccounts)
    .orderBy(psiAccounts.searchid);

  return result;
}

export async function getAccountsByPCM(pcm: string): Promise<Account[]> {
  const result = await db
    .select({
      accountId: psiAccounts.accountId,
      searchid: psiAccounts.searchid,
      accountType: psiAccounts.accountType,
      status: psiAccounts.status,
      pcm: psiAccounts.pcm,
      branch: psiAccounts.branch,
      accountEmail: psiAccounts.accountEmail,
    })
    .from(psiAccounts)
    .where(eq(psiAccounts.pcm, pcm));

  return result;
}

export async function getAccountProfile(accountId: string) {
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

export async function getAccountHoldings(accountId: string) {
  console.log("Fetching holdings for account:", accountId);
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

export async function getHolding(holdingId: string) {
  try {
    const [holding] = await db
      .select()
      .from(psiHoldings)
      .where(eq(psiHoldings.holdingId, holdingId));

    if (!holding) {
      console.log("No holding found with ID:", holdingId);
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
    throw error;
  }
}

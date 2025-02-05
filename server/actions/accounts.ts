"use server";

import { db } from "@/server/db";
import { psiAccounts, psiHoldings } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { checkAdmin } from "@/server/server-only/auth";
import { Account, Holding } from "@/types";

export async function getAccounts(): Promise<Account[]> {
  try {
    if (!checkAdmin()) {
      throw new Error("Unauthorized access");
    }

    const result = await db
      .select()
      .from(psiAccounts)
      .orderBy(psiAccounts.searchid);

    return result;
  } catch (error) {
    console.error("Error fetching accounts:", error);
    throw error;
  }
}

export async function getAccountsByPCM(pcm: string): Promise<Account[]> {
  try {
    if (!checkAdmin()) {
      throw new Error("Unauthorized access");
    }

    const result = await db
      .select()
      .from(psiAccounts)
      .where(eq(psiAccounts.pcm, pcm));

    return result;
  } catch (error) {
    console.error("Error fetching accounts by PCM:", error);
    throw error;
  }
}

export async function getAccountProfile(accountId: string): Promise<Account> {
  try {
    if (!checkAdmin()) {
      throw new Error("Unauthorized access");
    }

    const [account] = await db
      .select()
      .from(psiAccounts)
      .where(eq(psiAccounts.accountId, accountId));

    if (!account) {
      throw new Error(`No account found with ID: ${accountId}`);
    }

    return account;
  } catch (error) {
    console.error("Error fetching account profile:", error);
    throw error;
  }
}

export async function getAccountHoldings(
  accountId: string,
): Promise<Holding[]> {
  try {
    if (!checkAdmin()) {
      throw new Error("Unauthorized access");
    }

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

"use server";

import { db } from "@/server/db";
import { psiAccounts, psiHoldings, listValues } from "@/server/db/schema";
import { eq, and } from "drizzle-orm";
import { checkAdmin } from "@/server/server-only/auth";
import { Account, Holding } from "@/types";
import { AccountFormValues } from "@/types/forms";
import { revalidatePath } from "next/cache";

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

export async function createAccount(data: AccountFormValues) {
  try {
    await db.insert(psiAccounts).values({
      accountType: data.accountType,
      status: data.status,
      estDate: data.openDate,
      termDate: data.closeDate,
      clientIdPrimary: data.primaryClientId,
      clientIdJoint: data.jointClientId,
      branch: data.branch,
      invObjective: data.invObjective,
      riskTolerance: data.riskTolerance,
      timeHorizon: data.timeHorizon,
      pcm: data.pcm,
      date17A3: data.date17A3,
      method17A3: data.method17A3,
    });

    revalidatePath("/dashboard/accounts");
    return { success: true };
  } catch (error) {
    console.error("Error creating account:", error);
    throw new Error("Failed to create account");
  }
}

export async function updateAccount(
  accountId: string,
  data: AccountFormValues,
) {
  try {
    const result = await db
      .update(psiAccounts)
      .set({
        accountType: data.accountType,
        status: data.status,
        estDate: data.openDate,
        termDate: data.closeDate,
        clientIdPrimary: data.primaryClientId,
        clientIdJoint: data.jointClientId,
        branch: data.branch,
        invObjective: data.invObjective,
        riskTolerance: data.riskTolerance,
        timeHorizon: data.timeHorizon,
        pcm: data.pcm,
        date17A3: data.date17A3,
        method17A3: data.method17A3,
      })
      .where(eq(psiAccounts.accountId, accountId));

    revalidatePath("/dashboard/accounts");
  } catch (error) {
    console.error("Error updating account:", error);
    throw new Error("Failed to update account");
  }
}

export async function deleteAccount(accountId: string) {
  try {
    if (!checkAdmin()) {
      throw new Error("Unauthorized access");
    }

    // Delete associated holdings first
    await db.delete(psiHoldings).where(eq(psiHoldings.accountId, accountId));

    // Delete the account record
    await db.delete(psiAccounts).where(eq(psiAccounts.accountId, accountId));

    revalidatePath("/dashboard/accounts");
  } catch (error) {
    console.error("Error deleting account:", error);
    throw new Error("Failed to delete account");
  }
}

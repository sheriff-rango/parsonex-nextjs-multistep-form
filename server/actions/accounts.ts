"use server";

import { db } from "@/server/db";
import { psiAccounts } from "@/server/db/schema";
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
    .orderBy(psiAccounts.accountId);

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

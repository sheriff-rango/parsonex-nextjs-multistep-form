"use server";

import { db } from "@/server/db";
import { and, eq, sql } from "drizzle-orm";
import {
  clients,
  emails,
  phones,
  addresses,
  psiAccounts,
  clientFinprofile,
} from "@/server/db/schema";
import { ClientWithPhoneAndEmail } from "@/types";

export async function getClients(): Promise<ClientWithPhoneAndEmail[]> {
  const result = await db
    .select({
      clientId: clients.clientId,
      fullName: clients.nameFull,
      riaClient: clients.riaClient,
      bdClient: clients.bdClient,
      repFullname: clients.repFullname,
      isActive: clients.isActive,
      emailAddress: emails.emailAddress,
    })
    .from(clients)
    .leftJoin(
      emails,
      and(
        eq(emails.refId, clients.clientId),
        eq(emails.refTable, sql`'clients'`),
        eq(emails.isPrimary, true),
      ),
    )
    .orderBy(clients.nameFull);

  return result as ClientWithPhoneAndEmail[];
}

export async function getAccountsByClientId(clientId: string) {
  try {
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
      .where(eq(psiAccounts.ownerId, clientId))
      .orderBy(psiAccounts.accountId);

    return result;
  } catch (error) {
    console.error("Error fetching client accounts:", error);
    return [];
  }
}

export async function getClientEmails(clientId: string) {
  try {
    const results = await db
      .select()
      .from(emails)
      .where(and(eq(emails.refId, clientId), eq(emails.refTable, "clients")));
    return results;
  } catch (error) {
    console.error("Error fetching client emails:", error);
    return [];
  }
}

export async function getClientPhones(clientId: string) {
  try {
    const results = await db
      .select()
      .from(phones)
      .where(and(eq(phones.refId, clientId), eq(phones.refTable, "clients")));
    return results;
  } catch (error) {
    console.error("Error fetching client phones:", error);
    return [];
  }
}

export async function getClientAddresses(clientId: string) {
  try {
    const results = await db
      .select()
      .from(addresses)
      .where(
        and(eq(addresses.refId, clientId), eq(addresses.refTable, "clients")),
      );
    return results;
  } catch (error) {
    console.error("Error fetching client addresses:", error);
    return [];
  }
}

export async function getClientProfile(clientId: string) {
  try {
    const clientResult = await db
      .select()
      .from(clients)
      .where(eq(clients.clientId, clientId));

    if (!clientResult.length) {
      console.log("No client found with ID:", clientId);
      return null;
    }

    const client = clientResult[0];

    const finProfileResult = await db
      .select()
      .from(clientFinprofile)
      .where(eq(clientFinprofile.clientId, clientId));

    const [addresses, emails, phones, accounts] = await Promise.all([
      getClientAddresses(clientId),
      getClientEmails(clientId),
      getClientPhones(clientId),
      getAccountsByClientId(clientId),
    ]);

    return {
      client,
      finProfile: finProfileResult[0] || null,
      addresses,
      emails,
      phones,
      accounts,
    };
  } catch (error) {
    console.error("Error fetching client profile:", error);
    throw error;
  }
}

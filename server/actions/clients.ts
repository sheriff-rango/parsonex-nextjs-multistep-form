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
import { ClientWithPhoneAndEmail, ClientData, ContactField } from "@/types";
import { revalidatePath } from "next/cache";
import { checkAdmin } from "@/server/server-only/auth";

export async function getClients(): Promise<ClientWithPhoneAndEmail[] | null> {
  if (!checkAdmin()) {
    return null;
  }

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
  if (!checkAdmin()) {
    return null;
  }

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
  if (!checkAdmin()) {
    return null;
  }

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
  if (!checkAdmin()) {
    return null;
  }

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
  if (!checkAdmin()) {
    return null;
  }

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
  if (!checkAdmin()) {
    return null;
  }

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

export async function createClient(data: ClientData) {
  if (!checkAdmin()) {
    return null;
  }

  try {
    // Insert client
    const [client] = await db
      .insert(clients)
      .values({
        nameFull: data.nameFull,
        nameFirst: data.nameFirst ?? null,
        nameMiddle: data.nameMiddle ?? null,
        nameLast: data.nameLast ?? null,
        nameSuffix: data.nameSuffix ?? null,
        nameSalutation: data.nameSalutation ?? null,
        dob: data.dob ? sql`${data.dob}` : null,
        gender: data.gender ?? null,
        maritalstatus: data.maritalstatus ?? null,
        ssnTaxid: data.ssnTaxid ?? null,
        employmentStatus: data.employmentStatus ?? null,
        employmentOccupation: data.employmentOccupation ?? null,
        employer: data.employer ?? null,
        employerBusinessType: data.employerBusinessType ?? null,
        isUscitizen: data.isUscitizen ?? null,
        riaClient: data.riaClient ?? null,
        bdClient: data.bdClient ?? null,
        isActive: data.isActive ?? true,
      })
      .returning();

    // Insert financial profile if provided
    if (data.finProfile) {
      await db.insert(clientFinprofile).values({
        clientId: client.clientId,
        profileType: data.finProfile.profileType ?? null,
        networth: data.finProfile.networth?.toString() ?? null,
        networthLiquid: data.finProfile.networthLiquid?.toString() ?? null,
        incomeAnnual: data.finProfile.incomeAnnual?.toString() ?? null,
        taxbracket: data.finProfile.taxbracket ?? null,
        incomeSource: data.finProfile.incomeSource ?? null,
        investExperience: data.finProfile.investExperience ?? null,
        investExperienceYears:
          data.finProfile.investExperienceYears?.toString() ?? null,
        totalHeldawayAssets:
          data.finProfile.totalHeldawayAssets?.toString() ?? null,
        incomeSourceType: data.finProfile.incomeSourceType ?? null,
        incomeDescription: data.finProfile.incomeDescription ?? null,
        incomeSourceAdditional: data.finProfile.incomeSourceAdditional ?? null,
        jointClientId: data.finProfile.jointClientId ?? null,
      });
    }

    // Insert phones
    if (data.phones.length > 0) {
      await db.insert(phones).values(
        data.phones.map((phone: ContactField) => ({
          refTable: "clients",
          refId: client.clientId,
          phoneType: phone.type,
          phoneNumber: phone.value,
          isPrimary: phone.isPrimary,
        })),
      );
    }

    // Insert emails
    if (data.emails.length > 0) {
      await db.insert(emails).values(
        data.emails.map((email: ContactField) => ({
          refTable: "clients",
          refId: client.clientId,
          emailType: email.type,
          emailAddress: email.value,
          isPrimary: email.isPrimary,
        })),
      );
    }

    // Insert addresses
    if (data.addresses.length > 0) {
      await db.insert(addresses).values(
        data.addresses.map((address: ContactField) => {
          const [address1, address2, city, state, zip] =
            address.value.split(",");
          return {
            refTable: "clients",
            refId: client.clientId,
            addressType: address.type,
            address1: address1?.trim() ?? null,
            address2: address2?.trim() ?? null,
            city: city?.trim() ?? null,
            state: state?.trim() ?? null,
            zip: zip?.trim() ?? null,
            isPrimary: address.isPrimary,
          };
        }),
      );
    }

    revalidatePath("/dashboard/clients");
    return client;
  } catch (error) {
    console.error("Error creating client:", error);
    throw new Error("Failed to create client.");
  }
}

export async function updateClient(clientId: string, data: ClientData) {
  if (!checkAdmin()) {
    return null;
  }

  try {
    // Update client
    await db
      .update(clients)
      .set({
        nameFull: data.nameFull,
        nameFirst: data.nameFirst ?? null,
        nameMiddle: data.nameMiddle ?? null,
        nameLast: data.nameLast ?? null,
        nameSuffix: data.nameSuffix ?? null,
        nameSalutation: data.nameSalutation ?? null,
        dob: data.dob ? sql`${data.dob}` : null,
        gender: data.gender ?? null,
        maritalstatus: data.maritalstatus ?? null,
        ssnTaxid: data.ssnTaxid ?? null,
        employmentStatus: data.employmentStatus ?? null,
        employmentOccupation: data.employmentOccupation ?? null,
        employer: data.employer ?? null,
        employerBusinessType: data.employerBusinessType ?? null,
        isUscitizen: data.isUscitizen ?? null,
        riaClient: data.riaClient ?? null,
        bdClient: data.bdClient ?? null,
        isActive: data.isActive ?? true,
        lastupdated: sql`CURRENT_TIMESTAMP`,
      })
      .where(eq(clients.clientId, clientId));

    // Update or create financial profile
    if (data.finProfile) {
      await db
        .delete(clientFinprofile)
        .where(eq(clientFinprofile.clientId, clientId));

      await db.insert(clientFinprofile).values({
        clientId: clientId,
        profileType: data.finProfile.profileType ?? null,
        networth: data.finProfile.networth?.toString() ?? null,
        networthLiquid: data.finProfile.networthLiquid?.toString() ?? null,
        incomeAnnual: data.finProfile.incomeAnnual?.toString() ?? null,
        taxbracket: data.finProfile.taxbracket ?? null,
        incomeSource: data.finProfile.incomeSource ?? null,
        investExperience: data.finProfile.investExperience ?? null,
        investExperienceYears:
          data.finProfile.investExperienceYears?.toString() ?? null,
        totalHeldawayAssets:
          data.finProfile.totalHeldawayAssets?.toString() ?? null,
        incomeSourceType: data.finProfile.incomeSourceType ?? null,
        incomeDescription: data.finProfile.incomeDescription ?? null,
        incomeSourceAdditional: data.finProfile.incomeSourceAdditional ?? null,
        jointClientId: data.finProfile.jointClientId ?? null,
      });
    }

    // Delete existing contact info
    await Promise.all([
      db
        .delete(phones)
        .where(and(eq(phones.refId, clientId), eq(phones.refTable, "clients"))),
      db
        .delete(emails)
        .where(and(eq(emails.refId, clientId), eq(emails.refTable, "clients"))),
      db
        .delete(addresses)
        .where(
          and(eq(addresses.refId, clientId), eq(addresses.refTable, "clients")),
        ),
    ]);

    // Insert new phones
    if (data.phones.length > 0) {
      await db.insert(phones).values(
        data.phones.map((phone: ContactField) => ({
          refTable: "clients",
          refId: clientId,
          phoneType: phone.type,
          phoneNumber: phone.value,
          isPrimary: phone.isPrimary,
        })),
      );
    }

    // Insert new emails
    if (data.emails.length > 0) {
      await db.insert(emails).values(
        data.emails.map((email: ContactField) => ({
          refTable: "clients",
          refId: clientId,
          emailType: email.type,
          emailAddress: email.value,
          isPrimary: email.isPrimary,
        })),
      );
    }

    // Insert new addresses
    if (data.addresses.length > 0) {
      await db.insert(addresses).values(
        data.addresses.map((address: ContactField) => {
          const [address1, address2, city, state, zip] =
            address.value.split(",");
          return {
            refTable: "clients",
            refId: clientId,
            addressType: address.type,
            address1: address1?.trim() ?? null,
            address2: address2?.trim() ?? null,
            city: city?.trim() ?? null,
            state: state?.trim() ?? null,
            zip: zip?.trim() ?? null,
            isPrimary: address.isPrimary,
          };
        }),
      );
    }

    revalidatePath("/dashboard/clients");
    revalidatePath(`/dashboard/clients/${clientId}`);
  } catch (error) {
    console.error("Error updating client:", error);
    throw new Error("Failed to update client.");
  }
}

export async function deleteClient(clientId: string) {
  if (!checkAdmin()) {
    return null;
  }

  try {
    // Delete associated records first
    await Promise.all([
      db
        .delete(clientFinprofile)
        .where(eq(clientFinprofile.clientId, clientId)),
      db
        .delete(phones)
        .where(and(eq(phones.refId, clientId), eq(phones.refTable, "clients"))),
      db
        .delete(emails)
        .where(and(eq(emails.refId, clientId), eq(emails.refTable, "clients"))),
      db
        .delete(addresses)
        .where(
          and(eq(addresses.refId, clientId), eq(addresses.refTable, "clients")),
        ),
    ]);

    // Delete the client record
    await db.delete(clients).where(eq(clients.clientId, clientId));

    revalidatePath("/dashboard/clients");
  } catch (error) {
    console.error("Error deleting client:", error);
    throw new Error("Failed to delete client");
  }
}

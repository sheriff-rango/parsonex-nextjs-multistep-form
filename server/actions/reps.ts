"use server";

import { db } from "@/server/db";
import {
  reps,
  addresses,
  emails,
  phones,
  listRepTypes,
} from "@/server/db/schema";
import { ContactField, RepData } from "@/types";
import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function getReps() {
  console.log("Getting reps");
  try {
    const results = await db.select().from(reps).orderBy(reps.fullName);

    return results;
  } catch (error) {
    console.error("Error fetching reps:", error);
    return [];
  }
}

export async function getRepProfile(id: string) {
  try {
    const result = await db.select().from(reps).where(eq(reps.repId, id));
    return result[0];
  } catch (error) {
    console.error("Error fetching rep profile:", error);
    return null;
  }
}

export async function getRepAddresses(pcm: string) {
  try {
    const results = await db
      .select()
      .from(addresses)
      .where(and(eq(addresses.refId, pcm), eq(addresses.refTable, "reps")));
    return results;
  } catch (error) {
    console.error("Error fetching rep addresses:", error);
    return [];
  }
}

export async function getRepEmails(pcm: string) {
  try {
    const results = await db
      .select()
      .from(emails)
      .where(and(eq(emails.refId, pcm), eq(emails.refTable, "reps")));
    return results;
  } catch (error) {
    console.error("Error fetching rep emails:", error);
    return [];
  }
}

export async function getRepPhones(pcm: string) {
  try {
    const results = await db
      .select()
      .from(phones)
      .where(and(eq(phones.refId, pcm), eq(phones.refTable, "reps")));
    return results;
  } catch (error) {
    console.error("Error fetching rep phones:", error);
    return [];
  }
}

export async function getRepTypes() {
  try {
    const results = await db.select().from(listRepTypes);
    return results;
  } catch (error) {
    console.error("Error fetching rep types:", error);
    return [];
  }
}

export async function createRep(repData: RepData) {
  try {
    const repId = crypto.randomUUID().slice(0, 8);
    const createdOn = new Date();
    const rep = {
      repId,
      pcm: repId,
      createdOn: createdOn.toISOString(),
      ...repData,
    };

    console.log(rep);

    // Start a transaction to ensure all related data is inserted together
    await db.transaction(async (tx) => {
      // Insert the rep
      await tx.insert(reps).values(rep);

      // Process phone numbers
      if (repData.phones) {
        for (const phone of repData.phones) {
          await tx.insert(phones).values({
            refTable: "reps",
            refId: rep.repId,
            phoneType: phone.type,
            phoneNumber: phone.value,
            isPrimary: phone.isPrimary,
            createdAt: createdOn.toISOString(),
          });
        }
      }

      // Process email addresses
      if (repData.emails) {
        for (const email of repData.emails) {
          await tx.insert(emails).values({
            refTable: "reps",
            refId: rep.repId,
            emailType: email.type,
            emailAddress: email.value,
            isPrimary: email.isPrimary,
            createdAt: createdOn.toISOString(),
          });
        }
      }

      // Process addresses
      if (repData.addresses) {
        for (const address of repData.addresses) {
          const [address1, address2, city, state, zip] = address.value
            .split(",")
            .map((s: string) => s.trim());
          await tx.insert(addresses).values({
            refTable: "reps",
            refId: rep.repId,
            addressType: address.type,
            address1,
            address2: address2 || null,
            city,
            state,
            zip,
            isPrimary: address.isPrimary,
            createdOn: createdOn.toISOString(),
            lastUpdated: createdOn.toISOString(),
          });
        }
      }
    });

    revalidatePath("/dashboard/reps");
    return rep;
  } catch (error) {
    console.error("Error creating rep:", error);
    throw new Error("Failed to create rep.");
  }
}

export async function getRep(id: string) {
  try {
    const rep = await db.select().from(reps).where(eq(reps.repId, id));

    if (!rep || rep.length === 0) {
      throw new Error("Representative not found");
    }

    return rep[0];
  } catch (error) {
    console.error("Error getting rep:", error);
    throw error;
  }
}

export async function updateRep(id: string, data: RepData) {
  console.log(data);
  try {
    const {
      phones: phoneData,
      emails: emailData,
      addresses: addressData,
      ...repData
    } = data;

    repData.fullName = `${repData.firstName} ${repData.lastName}`;

    // Update main rep data
    await db.update(reps).set(repData).where(eq(reps.repId, id));

    // Update phones
    await db.delete(phones).where(eq(phones.refId, id));
    if (phoneData?.length) {
      await db.insert(phones).values(
        phoneData.map((phone: ContactField) => ({
          repId: id,
          refTable: "reps",
          refId: id,
          phoneType: phone.type,
          phoneNumber: phone.value,
          isPrimary: phone.isPrimary,
          createdAt: new Date().toISOString(),
        })),
      );
    }

    // Update emails
    await db.delete(emails).where(eq(emails.refId, id));
    if (emailData?.length) {
      await db.insert(emails).values(
        emailData.map((email: ContactField) => ({
          refTable: "reps",
          refId: id,
          emailType: email.type,
          emailAddress: email.value,
          isPrimary: email.isPrimary,
          createdAt: new Date().toISOString(),
        })),
      );
    }

    // Update addresses
    await db.delete(addresses).where(eq(addresses.refId, id));
    if (addressData?.length) {
      await db.insert(addresses).values(
        addressData.map((address: ContactField) => {
          // Split address value into components
          const [address1, address2, city, state, zip] =
            address.value.split(",");

          return {
            refTable: "reps",
            refId: id,
            addressType: address.type,
            address1: address1?.trim() || "",
            address2: address2?.trim() || "",
            city: city?.trim() || "",
            state: state?.trim() || "",
            zip: zip?.trim() || "",
            isPrimary: address.isPrimary,
            createdOn: new Date().toISOString(),
            lastUpdated: new Date().toISOString(),
          };
        }),
      );
    }

    revalidatePath("/dashboard/reps");
  } catch (error) {
    console.error("Error updating rep:", error);
    throw error;
  }
}

export async function deleteRep(repId: string) {
  try {
    await db.transaction(async (tx) => {
      // Delete associated records first
      await tx.delete(phones).where(eq(phones.refId, repId));
      await tx.delete(emails).where(eq(emails.refId, repId));
      await tx.delete(addresses).where(eq(addresses.refId, repId));

      // Delete the rep record last
      await tx.delete(reps).where(eq(reps.repId, repId));
    });

    revalidatePath("/dashboard/reps");
  } catch (error) {
    console.error("Error deleting rep:", error);
    throw new Error("Failed to delete rep.");
  }
}

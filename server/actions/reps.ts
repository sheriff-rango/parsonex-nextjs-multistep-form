"use server";

import { db } from "@/server/db";
import { reps, addresses, emails, phones } from "@/server/db/schema";
import { ContactField } from "@/types";
import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { checkAdmin } from "@/server/server-only/auth";
import { RepFormValues, repFormSchema } from "@/types/forms";

export async function getActiveReps() {
  try {
    if (!(await checkAdmin())) {
      console.error("Unauthorized access");
      return [];
    }

    const results = await db
      .select()
      .from(reps)
      .where(eq(reps.isActive, true))
      .orderBy(reps.fullName);
    return results;
  } catch (error) {
    console.error("Error fetching active reps:", error);
    return [];
  }
}

export async function getAllReps() {
  try {
    if (!(await checkAdmin())) {
      console.error("Unauthorized access");
      return [];
    }

    const results = await db.select().from(reps).orderBy(reps.fullName);
    return results;
  } catch (error) {
    console.error("Error fetching reps:", error);
    return [];
  }
}

export async function getRepProfile(pcm: string) {
  try {
    if (!(await checkAdmin())) {
      console.error("Unauthorized access");
      return null;
    }

    const result = await db.select().from(reps).where(eq(reps.pcm, pcm));
    return result[0];
  } catch (error) {
    console.error("Error fetching rep profile:", error);
    return null;
  }
}

export async function getRepAddresses(pcm: string) {
  try {
    if (!(await checkAdmin())) {
      console.error("Unauthorized access");
      return [];
    }

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
    if (!(await checkAdmin())) {
      console.error("Unauthorized access");
      return [];
    }

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
    if (!(await checkAdmin())) {
      console.error("Unauthorized access");
      return [];
    }

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

export async function createRep(formData: RepFormValues) {
  try {
    if (!(await checkAdmin())) {
      console.error("Unauthorized access");
      return null;
    }

    const validatedData = repFormSchema.parse(formData);
    const createdOn = new Date();

    const rep = {
      createdOn: createdOn.toISOString(),
      ...validatedData,
    };

    await db.transaction(async (tx) => {
      const pcm = await tx
        .insert(reps)
        .values(rep)
        .returning({ pcm: reps.pcm });

      if (validatedData.phones) {
        for (const phone of validatedData.phones) {
          await tx.insert(phones).values({
            refTable: "reps",
            refId: rep.pcm,
            phoneType: phone.type,
            phoneNumber: phone.value,
            isPrimary: phone.isPrimary,
            createdAt: createdOn.toISOString(),
          });
        }
      }

      if (validatedData.emails) {
        for (const email of validatedData.emails) {
          await tx.insert(emails).values({
            refTable: "reps",
            refId: rep.pcm,
            emailType: email.type,
            emailAddress: email.value,
            isPrimary: email.isPrimary,
            createdAt: createdOn.toISOString(),
          });
        }
      }

      // Process addresses
      if (validatedData.addresses) {
        for (const address of validatedData.addresses) {
          const [address1, address2, city, state, zip] = address.value
            .split(",")
            .map((s: string) => s.trim());
          await tx.insert(addresses).values({
            refTable: "reps",
            refId: rep.pcm,
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
    return null;
  }
}

export async function getRep(pcm: string) {
  try {
    if (!(await checkAdmin())) {
      console.error("Unauthorized access");
      return null;
    }

    const rep = await db.select().from(reps).where(eq(reps.pcm, pcm));

    if (!rep || rep.length === 0) {
      throw new Error("Representative not found");
    }

    return rep[0];
  } catch (error) {
    console.error("Error getting rep:", error);
    return null;
  }
}

export async function updateRep(formData: RepFormValues) {
  try {
    if (!(await checkAdmin())) {
      console.error("Unauthorized access");
      return null;
    }

    const validatedData = repFormSchema.parse(formData);
    const {
      phones: phoneData,
      emails: emailData,
      addresses: addressData,
      ...repData
    } = validatedData;

    const pcm = repData.pcm;

    // Update main rep data
    await db.update(reps).set(repData).where(eq(reps.pcm, pcm));

    // Update phones
    await db.delete(phones).where(eq(phones.refId, pcm));
    if (phoneData?.length) {
      await db.insert(phones).values(
        phoneData.map((phone: ContactField) => ({
          repId: pcm,
          refTable: "reps",
          refId: pcm,
          phoneType: phone.type,
          phoneNumber: phone.value,
          isPrimary: phone.isPrimary,
          createdAt: new Date().toISOString(),
        })),
      );
    }

    // Update emails
    await db.delete(emails).where(eq(emails.refId, pcm));
    if (emailData?.length) {
      await db.insert(emails).values(
        emailData.map((email: ContactField) => ({
          refTable: "reps",
          refId: pcm,
          emailType: email.type,
          emailAddress: email.value,
          isPrimary: email.isPrimary,
          createdAt: new Date().toISOString(),
        })),
      );
    }

    // Update addresses
    await db.delete(addresses).where(eq(addresses.refId, pcm));
    if (addressData?.length) {
      await db.insert(addresses).values(
        addressData.map((address: ContactField) => {
          // Split address value into components
          const [address1, address2, city, state, zip] =
            address.value.split(",");

          return {
            refTable: "reps",
            refId: pcm,
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
    return null;
  }
}

export async function deleteRep(pcm: string) {
  try {
    if (!(await checkAdmin())) {
      console.error("Unauthorized access");
      return null;
    }

    await db.transaction(async (tx) => {
      await tx.delete(phones).where(eq(phones.refId, pcm));
      await tx.delete(emails).where(eq(emails.refId, pcm));
      await tx.delete(addresses).where(eq(addresses.refId, pcm));
      await tx.delete(reps).where(eq(reps.pcm, pcm));
    });

    revalidatePath("/dashboard/reps");
  } catch (error) {
    console.error("Error deleting rep:", error);
    return null;
  }
}

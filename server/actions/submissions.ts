"use server";

import { db } from "@/server/db";
import { psiSubmissions } from "@/server/db/schema";
import { desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function getSubmissions() {
  try {
    const submissions = await db
      .select()
      .from(psiSubmissions)
      .orderBy(desc(psiSubmissions.dateReceived));

    return submissions;
  } catch (error) {
    console.error("Error fetching submissions:", error);
    return [];
  }
}

export async function createSubmission(data: any) {
  try {
    const submission = await db
      .insert(psiSubmissions)
      .values({
        ...data,
        pcm: "test",
        accountDescription: data.accountType,
        holdingsFunds: "",
        shipMethod: null,
        trackingNumber: null,
        enteredOn: new Date().toISOString(),
        enteredBy: "system",
        version: new Date().toISOString(),
      })
      .returning();

    revalidatePath("/dashboard/submissions");
    return submission[0];
  } catch (error) {
    console.error("Error creating submission:", error);
    return null;
  }
}

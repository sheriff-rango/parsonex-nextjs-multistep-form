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

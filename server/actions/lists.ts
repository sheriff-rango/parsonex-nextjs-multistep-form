"use server";

import { db } from "@/server/db";
import { listValues } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { checkAdmin } from "@/server/server-only/auth";

export type ListName =
  | "rep_types"
  | "id_types"
  | "submission_types"
  | "marital_status"
  | "email_types"
  | "annual_income_options"
  | "risk_tolerance"
  | "document_types"
  | "order_status"
  | "user_roles"
  | "workflow_statuses"
  | "networth_options"
  | "income_sources"
  | "payment_methods"
  | "liquid_networth_options"
  | "investment_objectives"
  | "time_horizon"
  | "account_roles"
  | "tax_bracket_options"
  | "account_types"
  | "fee_types"
  | "salutations"
  | "phone_types"
  | "contact_types"
  | "investment_experience"
  | "source_of_funds";

export async function getListValues(listName: ListName): Promise<string[]> {
  try {
    if (!checkAdmin()) {
      console.error("Unauthorized access");
      return [];
    }

    const results = await db
      .select({ name: listValues.name })
      .from(listValues)
      .where(eq(listValues.listName, listName))
      .orderBy(listValues.name);

    return results.map((result) => result.name);
  } catch (error) {
    console.error(`Error fetching ${listName}:`, error);
    return [];
  }
}

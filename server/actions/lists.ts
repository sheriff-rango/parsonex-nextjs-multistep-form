"use server";

import { db } from "@/server/db";
import { listValues } from "@/server/db/schema";
import { eq, and } from "drizzle-orm";
import { checkAdmin } from "@/server/server-only/auth";
import { revalidatePath } from "next/cache";

export async function getListValues(listName: string): Promise<string[]> {
  try {
    if (!(await checkAdmin())) {
      console.error("Unauthorized access");
      return [];
    }

    const results = await db
      .select({ name: listValues.name })
      .from(listValues)
      .where(eq(listValues.listName, listName))
      .orderBy(listValues.name);

    if (results.length === 0) {
      throw new Error(`List "${listName}" not found`);
    }

    return results.map((result) => result.name);
  } catch (error) {
    console.error(`Error fetching ${listName}:`, error);
    return [];
  }
}

export async function getAllLists() {
  try {
    if (!checkAdmin()) {
      throw new Error("Unauthorized access");
    }

    const results = await db
      .selectDistinct({ listName: listValues.listName })
      .from(listValues)
      .orderBy(listValues.listName);

    return results.map((result) => result.listName);
  } catch (error) {
    console.error("Error fetching all lists:", error);
    throw error;
  }
}

export async function getAllListsWithValues() {
  try {
    if (!checkAdmin()) {
      throw new Error("Unauthorized access");
    }
    const lists = await getAllLists();
    const listsWithValues = await Promise.all(
      lists.map(async (list) => ({
        name: list,
        values: await getListValues(list),
      })),
    );
    return listsWithValues;
  } catch (error) {
    console.error("Error fetching all lists with values:", error);
    throw error;
  }
}

export async function addListValue(listName: string, value: string) {
  try {
    if (!(await checkAdmin())) {
      throw new Error("Unauthorized access");
    }

    // Check if value already exists
    const existing = await db
      .select()
      .from(listValues)
      .where(
        and(eq(listValues.listName, listName), eq(listValues.name, value)),
      );

    if (existing.length > 0) {
      throw new Error(`Value "${value}" already exists in list "${listName}"`);
    }

    await db.insert(listValues).values({
      listName,
      name: value,
    });

    revalidatePath("/dashboard/settings");
    return { success: true };
  } catch (error) {
    console.error(`Error adding value to ${listName}:`, error);
    throw error;
  }
}

export async function deleteListValue(listName: string, value: string) {
  try {
    if (!(await checkAdmin())) {
      throw new Error("Unauthorized access");
    }

    const result = await db
      .delete(listValues)
      .where(
        and(eq(listValues.listName, listName), eq(listValues.name, value)),
      );

    if (!result) {
      throw new Error(`Value "${value}" not found in list "${listName}"`);
    }

    revalidatePath("/dashboard/settings");
    return { success: true };
  } catch (error) {
    console.error(`Error deleting value from ${listName}:`, error);
    throw error;
  }
}

export async function updateListValue(
  listName: string,
  oldValue: string,
  newValue: string,
) {
  try {
    if (!(await checkAdmin())) {
      throw new Error("Unauthorized access");
    }

    const result = await db
      .update(listValues)
      .set({ name: newValue })
      .where(
        and(eq(listValues.listName, listName), eq(listValues.name, oldValue)),
      );

    if (!result) {
      throw new Error(`Value "${oldValue}" not found in list "${listName}"`);
    }

    revalidatePath("/dashboard/settings");
    return { success: true };
  } catch (error) {
    console.error(`Error updating value from ${listName}:`, error);
    throw error;
  }
}

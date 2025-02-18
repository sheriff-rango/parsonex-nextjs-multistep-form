"use server";

import { db } from "@/server/db";
import { summaryProduction, listOrderTypes, clients } from "@/server/db/schema";
import { sql, and, eq, gte, lte } from "drizzle-orm";
import { checkAdmin } from "@/server/server-only/auth";

export async function getQuarterlyRevenue() {
  try {
    if (!(await checkAdmin())) {
      console.error("Unauthorized access");
      return [];
    }

    const fourYearsAgo = new Date();
    fourYearsAgo.setFullYear(fourYearsAgo.getFullYear() - 4);

    const result = await db
      .select({
        quarter: sql<string>`'Q' || EXTRACT(QUARTER FROM ${summaryProduction.bizDate})::text || ' ' || EXTRACT(YEAR FROM ${summaryProduction.bizDate})::text`,
        revenue: sql<number>`sum(${summaryProduction.production})`,
      })
      .from(summaryProduction)
      .innerJoin(
        listOrderTypes,
        eq(summaryProduction.productType, listOrderTypes.orderName),
      )
      .where(
        gte(
          summaryProduction.bizDate,
          sql`${fourYearsAgo.toISOString()}::date`,
        ),
      )
      .groupBy(
        sql`EXTRACT(YEAR FROM ${summaryProduction.bizDate}), EXTRACT(QUARTER FROM ${summaryProduction.bizDate})`,
      )
      .orderBy(
        sql`EXTRACT(YEAR FROM ${summaryProduction.bizDate}), EXTRACT(QUARTER FROM ${summaryProduction.bizDate})`,
      );

    return result;
  } catch (error) {
    console.error("Error fetching quarterly revenue:", error);
    return [];
  }
}

export async function getDashboardMetrics() {
  try {
    if (!(await checkAdmin())) {
      console.error("Unauthorized access");
      return null;
    }

    const activeClients = await db
      .select({ count: sql<number>`count(*)` })
      .from(clients)
      .where(eq(clients.isActive, true));

    const q4Production = await db
      .select({
        total: sql<number>`sum(${summaryProduction.production})`,
      })
      .from(summaryProduction)
      .where(
        and(
          gte(summaryProduction.bizDate, "2024-10-01"),
          lte(summaryProduction.bizDate, "2024-12-31"),
        ),
      );

    const totalArr = await db
      .select({
        total: sql<number>`sum(${summaryProduction.production})`,
      })
      .from(summaryProduction)
      .where(
        and(
          eq(summaryProduction.isArr, true),
          gte(summaryProduction.bizDate, "2024-10-01"),
          lte(summaryProduction.bizDate, "2024-12-31"),
        ),
      );

    const newInvestments = await db
      .select({
        total: sql<number>`sum(${summaryProduction.investmentAmt})`,
      })
      .from(summaryProduction)
      .where(
        and(
          gte(summaryProduction.bizDate, "2024-10-01"),
          lte(summaryProduction.bizDate, "2024-12-31"),
        ),
      );

    return {
      activeClients: activeClients[0]?.count ?? 0,
      q4Production: q4Production[0]?.total ?? 0,
      totalArr: totalArr[0]?.total ?? 0,
      newInvestments: newInvestments[0]?.total ?? 0,
    };
  } catch (error) {
    console.error("Error fetching dashboard metrics:", error);
    return null;
  }
}

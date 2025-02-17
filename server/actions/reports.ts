"use server";

import { db } from "@/server/db";
import { checkAdmin } from "@/server/server-only/auth";
import { ARRData, YearlyProductionData } from "@/types";
import { sql, and, eq, gte, lte, desc } from "drizzle-orm";
import { summaryProduction, listOrderTypes } from "@/server/db/schema";

export async function getARR(): Promise<ARRData[] | null> {
  try {
    if (!checkAdmin()) {
      throw new Error("Unauthorized access");
    }

    const result = await db
      .select({
        rep_name: summaryProduction.repSearchid,
        quarterly_production: sql<number>`sum(${summaryProduction.production})`,
        annual_recurring_revenue: sql<number>`sum(${summaryProduction.production}) * 4`,
      })
      .from(summaryProduction)
      .where(
        and(
          eq(summaryProduction.isArr, true),
          gte(summaryProduction.bizDate, "2024-10-01"),
          lte(summaryProduction.bizDate, "2024-12-31"),
        ),
      )
      .groupBy(summaryProduction.repSearchid)
      .orderBy(desc(sql`sum(${summaryProduction.production})`));

    return result.map((row) => ({
      rep_name: row.rep_name,
      quarterly_production: Number(row.quarterly_production),
      annual_recurring_revenue: Number(row.annual_recurring_revenue),
    }));
  } catch (error) {
    console.error("Error getting ARR data:", error);
    return null;
  }
}

export async function getRepYearlyProduction(
  repName: string,
): Promise<YearlyProductionData[] | null> {
  try {
    if (!checkAdmin()) {
      console.error("Unauthorized access");
      return null;
    }

    const result = await db
      .select({
        year: sql<number>`EXTRACT(YEAR FROM ${summaryProduction.bizDate})`,
        q1: sql<number>`SUM(CASE WHEN EXTRACT(QUARTER FROM ${summaryProduction.bizDate}) = 1 THEN ${summaryProduction.production} ELSE 0 END)`,
        q2: sql<number>`SUM(CASE WHEN EXTRACT(QUARTER FROM ${summaryProduction.bizDate}) = 2 THEN ${summaryProduction.production} ELSE 0 END)`,
        q3: sql<number>`SUM(CASE WHEN EXTRACT(QUARTER FROM ${summaryProduction.bizDate}) = 3 THEN ${summaryProduction.production} ELSE 0 END)`,
        q4: sql<number>`SUM(CASE WHEN EXTRACT(QUARTER FROM ${summaryProduction.bizDate}) = 4 THEN ${summaryProduction.production} ELSE 0 END)`,
        total: sql<number>`SUM(${summaryProduction.production})`,
      })
      .from(summaryProduction)
      .innerJoin(
        listOrderTypes,
        eq(summaryProduction.productType, listOrderTypes.orderName),
      )
      .where(eq(summaryProduction.repSearchid, repName))
      .groupBy(sql`EXTRACT(YEAR FROM ${summaryProduction.bizDate})`)
      .orderBy(desc(sql`EXTRACT(YEAR FROM ${summaryProduction.bizDate})`));

    return result.map((row) => ({
      year: Number(row.year),
      q1: Number(row.q1),
      q2: Number(row.q2),
      q3: Number(row.q3),
      q4: Number(row.q4),
      total: Number(row.total),
    }));
  } catch (error) {
    console.error("Error getting yearly production data:", error);
    return null;
  }
}

export async function generateReport({
  startDate,
  endDate,
  productType,
  isArr,
}: {
  startDate: string;
  endDate: string;
  productType?: string;
  isArr?: boolean;
}) {
  try {
    if (!checkAdmin()) {
      console.error("Unauthorized access");
      return null;
    }

    const whereConditions = [
      gte(summaryProduction.bizDate, startDate),
      lte(summaryProduction.bizDate, endDate),
    ];

    if (isArr) {
      whereConditions.push(eq(listOrderTypes.isArr, true));
    }

    if (productType && productType !== "all") {
      whereConditions.push(eq(summaryProduction.productCode, productType));
    }

    const result = await db
      .select({
        rep_name: summaryProduction.repSearchid,
        investment_amount: sql<number>`sum(${summaryProduction.investmentAmt})`,
        production: sql<number>`sum(${summaryProduction.production})`,
        commissions: sql<number>`sum(${summaryProduction.commissions})`,
      })
      .from(summaryProduction)
      .innerJoin(
        listOrderTypes,
        eq(summaryProduction.productCode, listOrderTypes.orderCode),
      )
      .where(and(...whereConditions))
      .groupBy(summaryProduction.repSearchid)
      .orderBy(sql`sum(${summaryProduction.production}) desc`);

    return result.map((row) => ({
      ...row,
      investment_amount: Number(row.investment_amount),
      production: Number(row.production),
      commissions: Number(row.commissions),
    }));
  } catch (error) {
    console.error("Error generating report:", error);
    return null;
  }
}

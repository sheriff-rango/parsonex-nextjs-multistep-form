import { db } from "@/server/db";
import { checkAdmin } from "@/server/server-only/auth";
import { summaryProduction, listOrderTypes } from "@/server/db/schema";
import { and, eq, gte, lte, sql } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    if (!checkAdmin()) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { startDate, endDate, productType, isArr } = await request.json();

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

    return NextResponse.json(
      result.map((row) => ({
        ...row,
        investment_amount: Number(row.investment_amount),
        production: Number(row.production),
        commissions: Number(row.commissions),
      })),
    );
  } catch (error) {
    console.error("Error generating report:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

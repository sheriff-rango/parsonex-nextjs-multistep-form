"use server";

import { db } from "@/server/db";
import { checkAdmin } from "@/server/server-only/auth";

export interface ARRData {
  pcm: string;
  rep_name: string;
  quarterly_production: number;
  annual_recurring_revenue: number;
}

export async function getARR(): Promise<ARRData[] | null> {
  try {
    if (!checkAdmin()) {
      throw new Error("Unauthorized access");
    }

    const query = `
      SELECT 
        sp.pcm,
        sp.rep_searchid AS rep_name,
        SUM(sp.production) AS quarterly_production,
        SUM(sp.production) * 4 AS annual_recurring_revenue
      FROM summary_production sp
      INNER JOIN list_order_types ot ON sp.product_type = ot.order_name
      WHERE ot.is_arr = TRUE
        AND sp.biz_date >= '2024-10-01'
        AND sp.biz_date <= '2024-12-31'
      GROUP BY sp.pcm, sp.rep_searchid
      ORDER BY annual_recurring_revenue DESC;
    `;

    const result = await db.execute(query);
    return result.rows.map((row) => ({
      pcm: row.pcm as string,
      rep_name: row.rep_name as string,
      quarterly_production: Number(row.quarterly_production),
      annual_recurring_revenue: Number(row.annual_recurring_revenue),
    }));
  } catch (error) {
    console.error("Error getting ARR data:", error);
    return null;
  }
}

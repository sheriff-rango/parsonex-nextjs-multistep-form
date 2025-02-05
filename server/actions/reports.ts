"use server";

import { db } from "@/server/db";
import { checkAdmin } from "@/server/server-only/auth";
import { ARRData, YearlyProductionData } from "@/types";

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

export async function getRepYearlyProduction(
  repName: string,
): Promise<YearlyProductionData[]> {
  const query = `
    WITH quarterly_data AS (
      SELECT 
        EXTRACT(YEAR FROM sp.biz_date) as year,
        EXTRACT(QUARTER FROM sp.biz_date) as quarter,
        SUM(sp.production) as production
      FROM summary_production sp
      INNER JOIN list_order_types ot ON sp.product_type = ot.order_name
      WHERE sp.rep_searchid = '${repName}'
      GROUP BY 
        EXTRACT(YEAR FROM sp.biz_date),
        EXTRACT(QUARTER FROM sp.biz_date)
    )
    SELECT 
      year,
      SUM(CASE WHEN quarter = 1 THEN production ELSE 0 END) as q1,
      SUM(CASE WHEN quarter = 2 THEN production ELSE 0 END) as q2,
      SUM(CASE WHEN quarter = 3 THEN production ELSE 0 END) as q3,
      SUM(CASE WHEN quarter = 4 THEN production ELSE 0 END) as q4,
      SUM(production) as total
    FROM quarterly_data
    GROUP BY year
    ORDER BY year DESC;
  `;

  const result = await db.execute(query);
  return result.rows.map((row) => ({
    year: Number(row.year),
    q1: Number(row.q1),
    q2: Number(row.q2),
    q3: Number(row.q3),
    q4: Number(row.q4),
    total: Number(row.total),
  }));
}

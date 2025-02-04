import { H1 } from "@/components/typography";
import { db } from "@/server/db";

interface YearlyProductionData {
  year: number;
  q1: number;
  q2: number;
  q3: number;
  q4: number;
  total: number;
}

async function getRepYearlyProduction(
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

export default async function RepProductionPage({
  params,
}: {
  params: { id: string };
}) {
  const repName = decodeURIComponent(params.id);
  const productionData = await getRepYearlyProduction(repName);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="flex h-full flex-col space-y-8 overflow-y-auto">
      <H1>Production History: {repName}</H1>
      <div className="rounded-md border">
        <table className="w-full bg-background">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="p-4 text-left">Year</th>
              <th className="p-4 text-right">Q1</th>
              <th className="p-4 text-right">Q2</th>
              <th className="p-4 text-right">Q3</th>
              <th className="p-4 text-right">Q4</th>
              <th className="p-4 text-right font-bold">Total</th>
            </tr>
          </thead>
          <tbody>
            {productionData.map((item) => (
              <tr key={item.year} className="border-b">
                <td className="p-4 font-medium">{item.year}</td>
                <td className="p-4 text-right">{formatCurrency(item.q1)}</td>
                <td className="p-4 text-right">{formatCurrency(item.q2)}</td>
                <td className="p-4 text-right">{formatCurrency(item.q3)}</td>
                <td className="p-4 text-right">{formatCurrency(item.q4)}</td>
                <td className="p-4 text-right font-bold">
                  {formatCurrency(item.total)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

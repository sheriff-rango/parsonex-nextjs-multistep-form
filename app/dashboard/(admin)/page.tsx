import { H1 } from "@/components/typography";
import { Card } from "@/components/ui/card";
import { GradientChart } from "@/components/gradient-chart";
import { db } from "@/server/db";
import { summaryProduction, listOrderTypes, clients } from "@/server/db/schema";
import { sql, eq, gte, lte, and } from "drizzle-orm";

async function getQuarterlyRevenue() {
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
      gte(summaryProduction.bizDate, sql`${fourYearsAgo.toISOString()}::date`),
    )
    .groupBy(
      sql`EXTRACT(YEAR FROM ${summaryProduction.bizDate}), EXTRACT(QUARTER FROM ${summaryProduction.bizDate})`,
    )
    .orderBy(
      sql`EXTRACT(YEAR FROM ${summaryProduction.bizDate}), EXTRACT(QUARTER FROM ${summaryProduction.bizDate})`,
    );

  return result;
}

async function getDashboardMetrics() {
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

  // Get new investment dollars in Q4
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
}

export default async function Page() {
  const quarterlyRevenue = await getQuarterlyRevenue();
  const metrics = await getDashboardMetrics();

  const formatCurrency = (value: number) => {
    if (value >= 1000000000) return `$${(value / 1000000000).toFixed(1)}B`;
    if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
    return `$${value}`;
  };

  return (
    <div className="@container space-y-6">
      <H1>Dashboard</H1>

      <div className="grid grid-cols-4 gap-4">
        <MetricCard
          title="Q4 Production"
          value={formatCurrency(metrics.q4Production)}
        />
        <MetricCard
          title="Total ARR"
          value={formatCurrency(metrics.totalArr)}
        />
        <MetricCard
          title="Q4 New Investments"
          value={formatCurrency(metrics.newInvestments)}
        />
        <MetricCard
          title="Active Clients"
          value={metrics.activeClients.toLocaleString()}
        />

        <div className="col-span-4">
          <GradientChart data={quarterlyRevenue} />
        </div>
      </div>
    </div>
  );
}

interface MetricCardProps {
  title: string;
  value: string;
  description?: string;
}

function MetricCard({ title, value }: MetricCardProps) {
  return (
    <Card className="space-y-2 p-4 pb-6 text-center">
      <div className="font-medium text-gray-500">{title}</div>
      <div className="text-5xl font-medium">{value}</div>
    </Card>
  );
}

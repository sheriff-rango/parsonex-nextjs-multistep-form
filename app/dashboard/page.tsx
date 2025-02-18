import { H1 } from "@/components/typography";
import { Card } from "@/components/ui/card";
import { GradientChart } from "@/components/gradient-chart";
import {
  getQuarterlyRevenue,
  getDashboardMetrics,
} from "@/server/actions/dashboard";
import { checkAdmin } from "@/server/server-only/auth";

export default async function Page() {
  const isAdmin = await checkAdmin();

  if (!isAdmin) {
    return <div>You are not authorized to access this page</div>;
  }

  const quarterlyRevenue = (await getQuarterlyRevenue()) || [];
  const metrics = (await getDashboardMetrics()) || {
    q4Production: 1_200_000,
    totalArr: 916_000,
    newInvestments: 28_500_000,
    activeClients: 4681,
  };

  const formatValue = (value: number) => {
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
          value={formatValue(metrics.q4Production)}
        />
        <MetricCard title="Total ARR" value={formatValue(metrics.totalArr)} />
        <MetricCard
          title="Q4 New Investments"
          value={formatValue(metrics.newInvestments)}
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

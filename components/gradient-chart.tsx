"use client";

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Badge } from "@/components/ui/badge";

interface RevenueData {
  quarter: string;
  revenue: number;
}

const chartConfig = {
  revenue: {
    label: "Revenue",
    color: "var(--primary)",
  },
} satisfies ChartConfig;

const formatRevenue = (value: number) => {
  if (value >= 1000000) {
    return `$${(value / 1000000).toFixed(1)}M`;
  }
  if (value >= 1000) {
    return `$${(value / 1000).toFixed(0)}K`;
  }
  return `$${value}`;
};

export function GradientChart({ data }: { data: RevenueData[] }) {
  const currentYear = new Date().getFullYear();
  const lastQuarter = data[data.length - 1];
  const previousQuarter = data[data.length - 2];

  // Calculate min and max for domain with some padding
  const maxRevenue = Math.max(...data.map((d) => d.revenue));
  const minRevenue = Math.min(...data.map((d) => d.revenue));
  const padding = (maxRevenue - minRevenue) * 0.1; // 10% padding

  const percentageChange =
    previousQuarter && lastQuarter
      ? ((lastQuarter.revenue - previousQuarter.revenue) /
          previousQuarter.revenue) *
        100
      : 0;

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle>Quarterly Revenue</CardTitle>
            <CardDescription>
              {data[0]?.quarter} - {lastQuarter?.quarter}
            </CardDescription>
          </div>
          <Badge variant={percentageChange > 0 ? "success" : "destructive"}>
            {percentageChange > 0 ? "↑" : "↓"}{" "}
            {Math.abs(percentageChange).toFixed(1)}%
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-80 w-full">
          <AreaChart accessibilityLayer data={data}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="quarter"
              tickLine={true}
              axisLine={false}
              tickMargin={8}
              interval={3}
              textAnchor="end"
            />
            <YAxis
              tickFormatter={formatRevenue}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              domain={[minRevenue - padding, maxRevenue + padding]}
              allowDataOverflow={false}
              ticks={[0, 100000, 200000, 300000, 400000, 500000]}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <defs>
              <linearGradient id="fillRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-revenue)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-revenue)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <Area
              dataKey="revenue"
              type="natural"
              fill="url(#fillRevenue)"
              fillOpacity={0.4}
              stroke="var(--color-revenue)"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

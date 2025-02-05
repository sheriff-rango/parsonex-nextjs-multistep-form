import { H1 } from "@/components/typography";
import { getRepYearlyProduction } from "@/server/actions/reports";

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

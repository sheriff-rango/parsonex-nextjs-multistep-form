import { DataTable } from "@/components/data-table";
import { columns } from "./columns";
import { getARR } from "@/server/actions/reports";
import { H1 } from "@/components/typography";

export default async function ReportsPage() {
  const data = await getARR();

  return (
    <div className="flex h-full flex-col space-y-8">
      <H1>Annual Recurring Revenue Report</H1>
      <DataTable
        columns={columns}
        data={data}
        basePath="/dashboard/reports/revenue"
        idField="rep_name"
        searchField="rep_name"
      />
    </div>
  );
}

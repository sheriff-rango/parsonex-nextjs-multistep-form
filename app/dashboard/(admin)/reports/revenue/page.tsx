import { DataTable } from "@/components/data-table";
import { columns } from "./columns";
import { getARR } from "@/server/actions/reports";
import { H1 } from "@/components/typography";

export default async function ReportsPage() {
  const data = await getARR();

  return (
    <>
      <div className="bg-gray-bg sticky top-16 z-10 flex items-center justify-between">
        <H1>Revenue Report</H1>
      </div>
      <DataTable
        columns={columns}
        data={data}
        basePath="/dashboard/reports/revenue"
        idField="rep_name"
        searchField="rep_name"
      />
    </>
  );
}

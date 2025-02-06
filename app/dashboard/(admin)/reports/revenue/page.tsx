import { DataTable } from "@/components/data-table";
import { columns } from "./columns";
import { getARR } from "@/server/actions/reports";
import { StickyHeader } from "@/components/sticky-header";

export default async function ReportsPage() {
  const data = (await getARR()) || [];

  return (
    <>
      <StickyHeader title="Revenue Report" />
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

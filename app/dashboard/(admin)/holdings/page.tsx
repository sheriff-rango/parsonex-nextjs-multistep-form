import { getHoldings } from "@/server/actions/holdings";
import { DataTable } from "@/components/data-table";
import { columns } from "./columns";
import { StickyHeader } from "@/components/sticky-header";

export default async function HoldingsPage() {
  const holdings = (await getHoldings()) || [];

  return (
    <>
      <StickyHeader title="Holdings" />
      <DataTable
        columns={columns}
        data={holdings}
        basePath="/dashboard/holdings"
        idField="holdingId"
        searchField="securityName"
      />
    </>
  );
}

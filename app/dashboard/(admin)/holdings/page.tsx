import { getHoldings } from "@/server/actions/holdings";
import { DataTable } from "@/components/data-table";
import { columns } from "./columns";
import { H1 } from "@/components/typography";

export default async function HoldingsPage() {
  const holdings = await getHoldings();

  return (
    <>
      <H1>Holdings</H1>
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

import { getHoldings } from "@/server/actions/holdings";
import { DataTable } from "@/components/data-table";
import { columns } from "./columns";
import { H1 } from "@/components/typography";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function HoldingsPage() {
  const holdings = await getHoldings();

  return (
    <>
      <div className="bg-gray-bg sticky top-16 z-10 flex items-center justify-between">
        <H1>Holdings</H1>
        <Link href="#">
          <Button>New Holding</Button>
        </Link>
      </div>
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

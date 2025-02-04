import { getReps } from "@/server/actions/reps";
import { DataTable } from "@/components/data-table";
import { columns } from "./columns";
import { H1 } from "@/components/typography";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function RepsPage() {
  const reps = await getReps();

  return (
    <>
      <div className="flex items-center justify-between">
        <H1>Reps</H1>
        <Link href="/dashboard/reps/new">
          <Button>New Rep</Button>
        </Link>
      </div>
      <DataTable
        columns={columns}
        data={reps}
        basePath="/dashboard/reps"
        idField="repId"
        searchField="fullName"
      />
    </>
  );
}

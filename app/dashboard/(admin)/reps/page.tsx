import { getActiveReps } from "@/server/actions/reps";
import { DataTable } from "@/components/data-table";
import { columns } from "./columns";
import { StickyHeader } from "@/components/sticky-header";

export default async function RepsPage() {
  const reps = await getActiveReps();

  return (
    <>
      <StickyHeader
        title="Reps"
        link="/dashboard/reps/new"
        buttonText="New Rep"
      />
      <DataTable
        columns={columns}
        data={reps}
        basePath="/dashboard/reps"
        idField="pcm"
        searchField="fullName"
      />
    </>
  );
}

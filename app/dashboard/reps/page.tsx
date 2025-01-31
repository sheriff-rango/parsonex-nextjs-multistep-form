import { getReps } from "@/server/actions/reps";
import { DataTable } from "./data-table";
import { columns } from "./columns";

export default async function RepsPage() {
  const { reps } = await getReps();

  return <DataTable columns={columns} data={reps} />;
}

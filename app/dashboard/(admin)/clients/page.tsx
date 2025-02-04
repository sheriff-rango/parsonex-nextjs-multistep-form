import { getClients } from "@/server/actions/clients";
import { DataTable } from "@/components/data-table";
import { columns } from "./columns";
import { H1 } from "@/components/typography";

export default async function ClientsPage() {
  const clients = await getClients();

  return (
    <>
      <H1>Clients</H1>
      <DataTable
        columns={columns}
        data={clients}
        basePath="/dashboard/clients"
        idField="clientId"
        searchField="fullName"
      />
    </>
  );
}

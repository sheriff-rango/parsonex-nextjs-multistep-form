import { getClients } from "@/server/actions/clients";
import { DataTable } from "@/components/data-table";
import { columns } from "./columns";
import { StickyHeader } from "@/components/sticky-header";

export default async function ClientsPage() {
  const clients = (await getClients()) || [];

  return (
    <>
      <StickyHeader
        title="Clients"
        link="/dashboard/clients/new"
        buttonText="New Client"
      />
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

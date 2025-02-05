import { getClients } from "@/server/actions/clients";
import { DataTable } from "@/components/data-table";
import { columns } from "./columns";
import { H1 } from "@/components/typography";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function ClientsPage() {
  const clients = await getClients();

  return (
    <>
      <div className="bg-gray-bg sticky top-16 z-10 flex items-center justify-between">
        <H1>Clients</H1>
        <Link href="/dashboard/clients/new">
          <Button>New Client</Button>
        </Link>
      </div>
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

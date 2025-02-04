import { getAccounts } from "@/server/actions/accounts";
import { DataTable } from "@/components/data-table";
import { columns } from "./columns";
import { H1 } from "@/components/typography";

export default async function AccountsPage() {
  const accounts = await getAccounts();

  return (
    <>
      <H1>Accounts</H1>
      <DataTable
        columns={columns}
        data={accounts}
        basePath="/dashboard/accounts"
        idField="accountId"
        searchField="searchid"
      />
    </>
  );
}

import { getAccounts } from "@/server/actions/accounts";
import { DataTable } from "@/components/data-table";
import { columns } from "./columns";
import { StickyHeader } from "@/components/sticky-header";

export default async function AccountsPage() {
  const accounts = (await getAccounts()) || [];

  return (
    <>
      <StickyHeader title="Accounts" />
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

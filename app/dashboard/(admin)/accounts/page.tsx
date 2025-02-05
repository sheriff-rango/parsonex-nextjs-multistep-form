import { getAccounts } from "@/server/actions/accounts";
import { DataTable } from "@/components/data-table";
import { columns } from "./columns";
import { H1 } from "@/components/typography";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function AccountsPage() {
  const accounts = (await getAccounts()) || [];

  return (
    <>
      <div className="sticky top-16 z-10 flex items-center justify-between bg-gray-bg">
        <H1>Accounts</H1>
        <Link href="#">
          <Button>New Account</Button>
        </Link>
      </div>
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

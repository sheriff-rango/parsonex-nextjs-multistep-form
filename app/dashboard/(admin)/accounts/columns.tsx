"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Account } from "@/server/actions/accounts";

export const columns: ColumnDef<Account>[] = [
  {
    accessorKey: "accountId",
    header: "Account ID",
    size: 150,
  },
  {
    accessorKey: "searchid",
    header: "Name",
    size: 150,
  },
  {
    accessorKey: "accountType",
    header: "Type",
    size: 150,
  },
  {
    accessorKey: "status",
    header: "Status",
    size: 100,
  },
  {
    accessorKey: "branch",
    header: "Branch",
    size: 100,
  },
];

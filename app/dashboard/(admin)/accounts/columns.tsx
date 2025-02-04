"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Account } from "@/server/actions/accounts";

export const columns: ColumnDef<Account>[] = [
  {
    accessorKey: "searchid",
    header: "Name",
    size: 600,
    enableResizing: true,
  },
  {
    accessorKey: "accountType",
    header: "Type",
    size: 100,
  },
  {
    accessorKey: "status",
    header: "Status",
    size: 100,
  },
  {
    accessorKey: "branch",
    header: "Branch",
    size: 200,
  },
];

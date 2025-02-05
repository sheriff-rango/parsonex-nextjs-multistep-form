"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Account } from "@/types";

export const columns: ColumnDef<Account>[] = [
  {
    accessorKey: "searchid",
    header: "Name",
    size: 225,
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

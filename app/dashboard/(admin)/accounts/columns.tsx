"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Account } from "@/types";

export const columns: ColumnDef<Account>[] = [
  {
    accessorKey: "searchid",
    header: "Name",
    size: 400,
    enableResizing: true,
  },
  {
    accessorKey: "accountType",
    header: "Type",
    size: 150,
  },
  {
    accessorKey: "branch",
    header: "Branch",
    size: 150,
  },
  {
    accessorKey: "status",
    header: "Status",
    size: 100,
  },
];

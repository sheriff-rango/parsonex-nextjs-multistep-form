"use client";

import { ColumnDef } from "@tanstack/react-table";

export type SimpleAccount = {
  accountId: string;
  searchid: string | null;
  accountType: string | null;
  status: string | null;
  pcm: string | null;
  branch: string | null;
  accountEmail: string | null;
};

export const columns: ColumnDef<SimpleAccount>[] = [
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
    accessorKey: "pcm",
    header: "PCM",
    size: 150,
  },
  {
    accessorKey: "branch",
    header: "Branch",
    size: 200,
  },
];

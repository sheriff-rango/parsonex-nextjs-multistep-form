"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Rep } from "@/types";

export const columns: ColumnDef<Rep>[] = [
  {
    accessorKey: "fullName",
    header: "Name",
  },
  {
    accessorKey: "pcm",
    header: "PCM",
  },
  {
    accessorKey: "repType",
    header: "Type",
  },
  {
    accessorKey: "isBranchMgr",
    header: "Branch Manager",
    cell: ({ row }) => {
      const isBranchMgr = row.original.isBranchMgr;
      return <div>{isBranchMgr ? "Yes" : "No"}</div>;
    },
  },
];

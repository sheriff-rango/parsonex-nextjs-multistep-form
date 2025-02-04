"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Rep } from "@/types";

export const columns: ColumnDef<Rep>[] = [
  {
    accessorKey: "fullName",
    header: "Name",
    size: 300,
    cell: ({ row }) => {
      const isBranchMgr = row.original.isBranchMgr;
      return (
        <div className="flex items-center gap-2">
          <div>{row.getValue("fullName")}</div>
          {isBranchMgr && <div className="size-3 rounded-full bg-blue-500" />}
        </div>
      );
    },
  },
  {
    accessorKey: "pcm",
    header: "PCM",
    size: 100,
  },
  {
    accessorKey: "repType",
    header: "Type",
    size: 100,
  },
];

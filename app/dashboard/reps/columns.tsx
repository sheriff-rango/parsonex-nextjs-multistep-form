"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";

type Rep = {
  repId: string;
  pcm: string | null;
  firstname: string | null;
  lastname: string | null;
  fullname: string | null;
  isActive: boolean | null;
  repType: string;
  isBranchMgr: boolean | null;
  profilePictureUrl: string | null;
};

export const columns: ColumnDef<Rep>[] = [
  {
    accessorKey: "fullname",
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
    accessorKey: "isActive",
    header: "Status",
    cell: ({ row }) => {
      const isActive = row.getValue("isActive") as boolean;
      return (
        <Badge variant={isActive ? "default" : "secondary"}>
          {isActive ? "Active" : "Inactive"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "isBranchMgr",
    header: "Branch Manager",
    cell: ({ row }) => {
      const isBranchMgr = row.getValue("isBranchMgr") as boolean;
      return isBranchMgr ? "Yes" : "No";
    },
  },
];

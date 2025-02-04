"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ClientWithPhoneAndEmail } from "@/types";

export const columns: ColumnDef<ClientWithPhoneAndEmail>[] = [
  {
    accessorKey: "clientId",
    header: "Client ID",
  },
  {
    accessorKey: "fullName",
    header: "Name",
    size: 300,
  },
  {
    accessorKey: "emailAddress",
    header: "Email",
  },
  {
    accessorKey: "isActive",
    header: "Status",
    cell: ({ row }) => {
      const isActive = row.getValue("isActive") as boolean;
      return isActive ? "Active" : "Inactive";
    },
  },
];

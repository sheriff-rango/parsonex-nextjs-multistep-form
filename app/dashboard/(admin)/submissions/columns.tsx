"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";

export const columns: ColumnDef<any>[] = [
  {
    header: "First Name",
    accessorKey: "clientFirstName",
  },
  {
    header: "Last Name",
    accessorKey: "clientLastName",
  },
  {
    accessorKey: "accountType",
    header: "Account Type",
  },
  {
    accessorKey: "tradeAmount",
    header: "Trade Amount",
    cell: ({ row }) => formatCurrency(row.getValue("tradeAmount")),
  },
  {
    accessorKey: "dateReceived",
    header: "Date Received",
    cell: ({ row }) =>
      new Date(row.getValue("dateReceived")).toLocaleDateString(),
  },
  {
    accessorKey: "estGdc",
    header: "Est. GDC",
    cell: ({ row }) => formatCurrency(row.getValue("estGdc")),
  },
  {
    accessorKey: "statusId",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("statusId");
      let label = "Unknown";
      let variant: "default" | "destructive" | "outline" | "secondary" =
        "default";

      switch (status) {
        case 1:
          label = "Pending";
          variant = "secondary";
          break;
        case 2:
          label = "Processing";
          variant = "default";
          break;
        case 3:
          label = "Completed";
          variant = "outline";
          break;
        case 4:
          label = "Rejected";
          variant = "destructive";
          break;
      }

      return <Badge variant={variant}>{label}</Badge>;
    },
  },
];

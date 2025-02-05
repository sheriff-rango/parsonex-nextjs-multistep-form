"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ARRData } from "@/types";
import { formatCurrency } from "@/lib/utils";

export const columns: ColumnDef<ARRData>[] = [
  {
    accessorKey: "rep_name",
    header: "Representative",
  },
  {
    accessorKey: "quarterly_production",
    header: "Q4 Production",
    cell: ({ row }) => formatCurrency(row.getValue("quarterly_production")),
  },
  {
    accessorKey: "annual_recurring_revenue",
    header: "ARR",
    cell: ({ row }) => formatCurrency(row.getValue("annual_recurring_revenue")),
  },
];

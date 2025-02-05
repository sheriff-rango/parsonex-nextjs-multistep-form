"use client";

import { ColumnDef } from "@tanstack/react-table";
import { formatCurrency } from "@/lib/utils";

type ReportData = {
  rep_name: string;
  pcm: string;
  product_type: string;
  investment_amount: number;
  production: number;
  commissions: number;
};

export const columns: ColumnDef<ReportData>[] = [
  {
    accessorKey: "rep_name",
    header: "Representative",
  },

  {
    accessorKey: "production",
    header: "Production",
    cell: ({ row }) => formatCurrency(row.getValue("production")),
  },
  {
    accessorKey: "commissions",
    header: "Commissions",
    cell: ({ row }) => formatCurrency(row.getValue("commissions")),
  },
  {
    accessorKey: "investment_amount",
    header: "Investment Amount",
    cell: ({ row }) => formatCurrency(row.getValue("investment_amount")),
  },
];

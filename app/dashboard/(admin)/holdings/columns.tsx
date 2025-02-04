"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Holding } from "@/server/actions/holdings";

export const columns: ColumnDef<Holding>[] = [
  {
    accessorKey: "securityName",
    header: "Security Name",
    size: 200,
  },
  {
    accessorKey: "securityTicker",
    header: "Ticker",
    size: 100,
  },
  {
    accessorKey: "holdingType",
    header: "Type",
    size: 100,
  },
  {
    accessorKey: "units",
    header: "Units",
    size: 100,
    cell: ({ row }) => {
      const units = row.getValue("units") as number;
      return (
        units?.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }) ?? ""
      );
    },
  },
  {
    accessorKey: "unitPrice",
    header: "Unit Price",
    size: 100,
    cell: ({ row }) => {
      const price = row.getValue("unitPrice") as number;
      return price
        ? `$${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
        : "";
    },
  },
  {
    accessorKey: "marketValue",
    header: "Market Value",
    size: 120,
    cell: ({ row }) => {
      const value = row.getValue("marketValue") as number;
      return value
        ? `$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
        : "";
    },
  },
  {
    accessorKey: "costBasis",
    header: "Cost Basis",
    size: 120,
    cell: ({ row }) => {
      const cost = row.getValue("costBasis") as number;
      return cost
        ? `$${cost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
        : "";
    },
  },
  {
    accessorKey: "productFamily",
    header: "Product Family",
    size: 150,
  },
  {
    accessorKey: "repNo",
    header: "Rep #",
    size: 100,
  },
];

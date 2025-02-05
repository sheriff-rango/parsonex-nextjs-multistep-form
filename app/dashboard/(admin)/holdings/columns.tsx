"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Holding } from "@/server/actions/holdings";

export const columns: ColumnDef<Holding>[] = [
  {
    accessorKey: "securityName",
    header: "Security Name",
    size: 300,
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
    accessorKey: "productFamily",
    header: "Product Family",
    size: 150,
  },
  {
    accessorKey: "holdingFan",
    header: "Holding Fan",
    size: 100,
  },
];

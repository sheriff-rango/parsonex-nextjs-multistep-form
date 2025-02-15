"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Holding } from "@/types";

export const columns: ColumnDef<Holding>[] = [
  {
    accessorKey: "securityName",
    header: "Security Name",
    size: 300,
  },
  {
    accessorKey: "holdingType",
    header: "Type",
    size: 150,
  },
  {
    accessorKey: "productFamily",
    header: "Product Family",
    size: 150,
  },
  {
    accessorKey: "holdingFan",
    header: "Holding Fan",
    size: 150,
  },
];

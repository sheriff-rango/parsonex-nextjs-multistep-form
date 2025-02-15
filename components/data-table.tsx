"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  SortingState,
  getSortedRowModel,
  ColumnFiltersState,
  getFilteredRowModel,
  ColumnSizingState,
} from "@tanstack/react-table";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback } from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import React from "react";
import { ChevronRightIcon } from "lucide-react";
import { ChevronLeftIcon } from "lucide-react";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  basePath?: string;
  idField?: keyof TData;
  searchField?: string;
  stickySearch?: boolean;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  basePath,
  idField,
  searchField,
  stickySearch = true,
}: DataTableProps<TData, TValue>) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(name, value);
      } else {
        params.delete(name);
      }
      return params.toString();
    },
    [searchParams],
  );

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnSizing, setColumnSizing] = React.useState<ColumnSizingState>({});
  const [{ pageIndex, pageSize }, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 20,
  });

  const pagination = React.useMemo(
    () => ({
      pageIndex,
      pageSize,
    }),
    [pageIndex, pageSize],
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    columnResizeMode: "onChange",
    onColumnSizingChange: setColumnSizing,
    onPaginationChange: setPagination,
    state: {
      sorting,
      columnFilters,
      columnSizing,
      pagination,
    },
  });

  React.useEffect(() => {
    if (searchField) {
      const searchValue = searchParams.get("search") || "";
      table.getColumn(searchField)?.setFilterValue(searchValue);
    }
  }, [searchField, searchParams]);

  const handleSearchChange = useCallback(
    (value: string) => {
      if (searchField) {
        table.getColumn(searchField)?.setFilterValue(value);
        router.push(pathname + "?" + createQueryString("search", value), {
          scroll: false,
        });
      }
    },
    [searchField, router, pathname, createQueryString],
  );

  return (
    <div className="mb-6 px-1">
      <div className="mb-8 flex h-full flex-col">
        <div
          className={`z-10 flex w-full items-center justify-between bg-gray-bg ${
            stickySearch ? "sticky top-[7.25rem]" : ""
          }`}
        >
          {searchField && (
            <Input
              placeholder="Search"
              className="max-w-sm bg-background"
              value={
                (table.getColumn(searchField)?.getFilterValue() as string) ?? ""
              }
              onChange={(event) => handleSearchChange(event.target.value)}
            />
          )}
          <div className="flex items-center space-x-2">
            <p className="text-sm text-muted-foreground">Results per page</p>
            <Select
              value={table.getState().pagination.pageSize.toString()}
              onValueChange={(value) => {
                table.setPageSize(Number(value));
              }}
            >
              <SelectTrigger className="h-8 w-[70px]">
                <SelectValue
                  placeholder={table.getState().pagination.pageSize}
                />
              </SelectTrigger>
              <SelectContent side="top">
                {[20, 50, 100].map((size) => (
                  <SelectItem key={size} value={size.toString()}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex items-center justify-end gap-2 py-4 pl-4">
              <div className="mr-2 text-sm text-muted-foreground">
                {table.getState().pagination.pageIndex + 1} /{" "}
                {table.getPageCount()}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                <ChevronLeftIcon className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                <ChevronRightIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
        <div className="grow overflow-y-auto">
          <div className="overflow-hidden rounded-md border">
            <Table className="relative bg-background text-base">
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow
                    key={headerGroup.id}
                    className="hover:bg-background"
                  >
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead
                          key={header.id}
                          style={{ width: header.getSize() }}
                        >
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext(),
                              )}
                        </TableHead>
                      );
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                      className={
                        basePath && idField
                          ? "cursor-pointer hover:bg-muted/50"
                          : "hover:bg-background"
                      }
                      onClick={() => {
                        if (basePath && idField) {
                          const id = row.original[idField];
                          if (id) {
                            router.push(`${basePath}/${id}`);
                          }
                        }
                      }}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell
                          key={cell.id}
                          style={{ width: cell.column.getSize() }}
                          className="py-4"
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
}

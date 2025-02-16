"use client";

import { useState } from "react";
import { H1 } from "@/components/typography";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getAllLists, getListValues, ListName } from "@/server/actions/lists";
import { useQuery } from "@tanstack/react-query";

export default function ListsPage() {
  const [selectedList, setSelectedList] = useState<ListName | null>(null);

  const { data: lists = [] } = useQuery({
    queryKey: ["lists"],
    queryFn: async () => {
      const result = await getAllLists();
      return result as ListName[];
    },
  });

  const { data: listValues = [] } = useQuery({
    queryKey: ["listValues", selectedList],
    queryFn: async () => {
      if (!selectedList) return [];
      return getListValues(selectedList);
    },
    enabled: !!selectedList,
  });

  return (
    <div className="space-y-4 p-4">
      <H1>List Management</H1>

      <Card className="p-4">
        <div className="space-y-4">
          <div className="w-60">
            <Select
              onValueChange={(value: ListName) => setSelectedList(value)}
              value={selectedList || undefined}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a list to view" />
              </SelectTrigger>
              <SelectContent>
                {lists.map((list: ListName) => (
                  <SelectItem key={list} value={list}>
                    {list
                      .replace(/_/g, " ")
                      .replace(/\b\w/g, (l: string) => l.toUpperCase())}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedList && (
            <div className="mt-6">
              <h2 className="mb-4 text-lg font-semibold">
                {selectedList
                  .replace(/_/g, " ")
                  .replace(/\b\w/g, (l: string) => l.toUpperCase())}{" "}
                Values
              </h2>
              <div className="grid grid-cols-1 gap-2">
                {listValues.map((value: string) => (
                  <div
                    key={value}
                    className="rounded-lg bg-muted p-3 transition-colors hover:bg-muted/80"
                  >
                    {value}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}

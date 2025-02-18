"use client";

import { useState } from "react";
import { H1 } from "@/components/typography";
import { Card } from "@/components/ui/card";
import { addListValue } from "@/server/actions/lists";
import { ListMenu } from "@/components/list-menu";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function Lists({
  lists,
}: {
  lists: { name: string; values: string[] }[];
}) {
  const [open, setOpen] = useState(false);
  const [newValue, setNewValue] = useState("");
  const [selectedList, setSelectedList] = useState<string | null>(null);

  return (
    <div className="space-y-4">
      <H1>List Management</H1>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {lists.map((list) => (
          <Card key={list.name} className="p-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-medium">
                  {list.name
                    .replace(/_/g, " ")
                    .replace(/\b\w/g, (l) => l.toUpperCase())}
                </h2>
                <Button
                  size="icon"
                  onClick={() => {
                    setSelectedList(list.name);
                    setOpen(true);
                  }}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              <ScrollArea className="-mr-2 h-64 pr-2">
                <div className="grid grid-cols-1 gap-2">
                  {list.values.map((value) => (
                    <div
                      key={value}
                      className="flex items-center justify-between"
                    >
                      {value}
                      <ListMenu listName={list.name} listValue={value} />
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </Card>
        ))}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Value</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Input
              placeholder="Enter new value"
              value={newValue}
              onChange={(e) => setNewValue(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={async () => {
                if (selectedList && newValue) {
                  await addListValue(selectedList, newValue);
                  setOpen(false);
                  setNewValue("");
                }
              }}
            >
              Add
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

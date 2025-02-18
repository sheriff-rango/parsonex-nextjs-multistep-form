"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useState } from "react";
import { deleteListValue, updateListValue } from "@/server/actions/lists";

export function ListMenu({
  listName,
  listValue,
}: {
  listName: string;
  listValue: string;
}) {
  const [open, setOpen] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [newValue, setNewValue] = useState(listValue);

  const handleDelete = async () => {
    try {
      await deleteListValue(listName, listValue);
      setOpen(false);
      toast.success("List value deleted successfully");
    } catch (error) {
      console.error("Error deleting list value:", error);
      toast.error("Error deleting list value");
    }
  };

  const handleUpdate = async () => {
    if (newValue === listValue) return;

    try {
      await updateListValue(listName, listValue, newValue);
      setOpen(false);
      toast.success("List value updated successfully");
    } catch (error) {
      console.error("Error updating list value:", error);
      toast.error("Error updating list value");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onClick={() => {
              setNewValue(listValue);
              setIsUpdate(true);
              setOpen(true);
            }}
          >
            Update List Value
          </DropdownMenuItem>
          <DropdownMenuItem
            className="text-red-600"
            onClick={() => {
              setIsUpdate(false);
              setOpen(true);
            }}
          >
            Delete List Value
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isUpdate ? "Update List Value" : "Are you sure?"}
          </DialogTitle>
          <DialogDescription>
            {isUpdate
              ? "Update the value for this list item."
              : "This action cannot be undone. This will permanently delete the list value."}
          </DialogDescription>
        </DialogHeader>
        {isUpdate && (
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <input
                className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={newValue}
                onChange={(e) => setNewValue(e.target.value)}
                placeholder="Enter new value"
              />
            </div>
          </div>
        )}
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            variant={isUpdate ? "default" : "destructive"}
            onClick={isUpdate ? handleUpdate : handleDelete}
            disabled={isUpdate && newValue === listValue}
          >
            {isUpdate ? "Update" : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

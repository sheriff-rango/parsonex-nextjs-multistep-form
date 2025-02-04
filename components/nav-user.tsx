"use client";

import { UserButton, useUser } from "@clerk/nextjs";
import { SidebarMenu, SidebarMenuItem } from "@/components/ui/sidebar";

export function NavUser() {
  const { user } = useUser();

  return (
    <SidebarMenu>
      <SidebarMenuItem className="flex w-full items-center gap-3 overflow-hidden">
        <UserButton
          appearance={{
            elements: {
              userButtonAvatarBox: "size-7 pl-px",
              userButtonTrigger: "rounded-lg",
            },
          }}
        />
        <span className="shrink-0 text-sm">
          {user?.fullName || user?.primaryEmailAddress?.emailAddress || ""}
        </span>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

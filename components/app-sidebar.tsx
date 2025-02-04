"use client";

import * as React from "react";
import { Landmark, Briefcase, Home, User, Users } from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import { useAdmin } from "@/hooks/use-admin";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

const data = {
  navMain: [
    {
      title: "Home",
      url: "/dashboard",
      icon: Home,
    },
  ],
  adminLinks: [
    {
      title: "Reps",
      url: "/dashboard/reps",
      icon: User,
    },
    {
      title: "Clients",
      url: "/dashboard/clients",
      icon: Users,
    },
    {
      title: "Accounts",
      url: "/dashboard/accounts",
      icon: Landmark,
    },
    {
      title: "Holdings",
      url: "/dashboard/holdings",
      icon: Briefcase,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const isAdmin = useAdmin();
  const navItems = isAdmin
    ? [...data.navMain, ...data.adminLinks]
    : data.navMain;

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader></SidebarHeader>
      <SidebarContent>
        <NavMain items={navItems} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

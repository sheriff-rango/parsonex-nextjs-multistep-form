"use client";

import * as React from "react";
import {
  Landmark,
  Briefcase,
  Home,
  User,
  Users,
  BarChart,
  FileText,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";

import Image from "next/image";

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
    {
      title: "Submissions",
      url: "/dashboard/submissions",
      icon: FileText,
    },
    {
      title: "Reports",
      url: "/dashboard/reports",
      icon: BarChart,
    },
  ],
};

export function AppSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar> & { isAdmin?: boolean }) {
  const navItems = props.isAdmin
    ? [...data.navMain, ...data.adminLinks]
    : data.navMain;

  return (
    <Sidebar {...props}>
      <SidebarHeader className="p-4">
        <div className="relative flex aspect-[487/100] w-full items-center justify-center">
          <Image src="/parsonex-logo.avif" alt="Logo" fill />
        </div>
      </SidebarHeader>
      <SidebarContent className="px-2">
        <NavMain items={navItems} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

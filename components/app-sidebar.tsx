"use client";

import * as React from "react";
import Image from "next/image";
import dynamic from "next/dynamic";

import { NavMain } from "@/components/nav-main";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

import {
  Landmark,
  Briefcase,
  Home,
  User,
  Users,
  BarChart,
  FileText,
  Settings,
} from "lucide-react";

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
    {
      title: "Settings",
      url: "/dashboard/settings",
      icon: Settings,
    },
  ],
};

const NavUserDynamic = dynamic(
  () => import("@/components/nav-user").then((mod) => mod.NavUser),
  {
    ssr: false,
  },
);

export function AppSidebar({
  isAdmin,
  ...props
}: React.ComponentProps<typeof Sidebar> & { isAdmin?: boolean }) {
  const navItems = isAdmin
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
        <NavUserDynamic />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

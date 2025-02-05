"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  title: string;
  url: string;
  icon: LucideIcon;
}

interface NavMainProps {
  items: NavItem[];
}

export function NavMain({ items }: NavMainProps) {
  const pathname = usePathname();

  const isActive = (url: string) => {
    // Handle root dashboard path
    if (url === "/dashboard" && pathname === "/dashboard") {
      return true;
    }
    // For other paths, check if the current path starts with the url (for nested routes)
    return pathname.startsWith(url) && url !== "/dashboard";
  };

  return (
    <nav className="space-y-1">
      {items.map((item) => {
        const active = isActive(item.url);
        return (
          <Link
            key={item.url}
            href={item.url}
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
              active
                ? "bg-sidebar-accent text-sidebar-accent-foreground"
                : "text-sidebar-foreground/60 hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground",
            )}
          >
            <item.icon className="h-4 w-4" />
            <span>{item.title}</span>
          </Link>
        );
      })}
    </nav>
  );
}

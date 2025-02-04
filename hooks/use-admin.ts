"use client";

import { useUser } from "@clerk/nextjs";

export function useAdmin() {
  const { user } = useUser();
  return user?.publicMetadata?.role === "admin";
}

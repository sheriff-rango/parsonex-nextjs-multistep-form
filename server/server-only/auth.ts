import "server-only";

import { auth } from "@clerk/nextjs/server";
import { PrivateMetadata } from "@/types";

export async function checkAdmin() {
  const { sessionClaims } = await auth();
  const privateMetadata = sessionClaims?.privateMetadata as PrivateMetadata;
  const isAdmin = privateMetadata?.role === "admin";
  return isAdmin;
}

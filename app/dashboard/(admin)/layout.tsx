import { redirect } from "next/navigation";
import { checkAdmin } from "@/server/server-only/auth";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isAdmin = await checkAdmin();

  if (!isAdmin) {
    redirect("/dashboard");
  }

  return <>{children}</>;
}

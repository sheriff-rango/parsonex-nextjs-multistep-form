import { redirect } from "next/navigation";
import { checkAdmin } from "@/server/server-only/auth";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!(await checkAdmin())) {
    redirect("/dashboard");
  }

  return <>{children}</>;
}

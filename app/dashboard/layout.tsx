import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Header } from "@/components/header";
import { checkAdmin } from "@/server/server-only/auth";
import { Providers } from "@/components/providers";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const isAdmin = await checkAdmin();

  return (
    <Providers>
      <SidebarProvider>
        <AppSidebar isAdmin={isAdmin} />
        <SidebarInset className="bg-gray-bg">
          <Header />
          <div className="container pb-6">{children}</div>
        </SidebarInset>
      </SidebarProvider>
    </Providers>
  );
}

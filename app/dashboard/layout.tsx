import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Header } from "@/components/header";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="bg-gray-bg">
          <Header />
          <div className="container flex grow flex-col pb-6">{children}</div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

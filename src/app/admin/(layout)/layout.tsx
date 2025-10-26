import AdminLayoutClient from "@components/Templates/AdminLayout";
import AdminSideBar from "@components/Admin/Components/AdminSideBar";
import HeaderAdminSSR from "@components/Organisms/HeaderAdminSSR";
import dashboardService from "@services/dashboard";

async function getDashboardStats() {
  const dashboardStats = await dashboardService.getDashboardStats();
  return dashboardStats;
}

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const dashboardStats = await getDashboardStats() as any;

  return (
    <div className="flex h-screen bg-white">
      <AdminSideBar />
      <div className="flex flex-1 flex-col overflow-hidden lg:ml-0">
        <HeaderAdminSSR />
        <AdminLayoutClient dashboardStats={dashboardStats.data}>{children}</AdminLayoutClient>
      </div>
    </div>
  );
}

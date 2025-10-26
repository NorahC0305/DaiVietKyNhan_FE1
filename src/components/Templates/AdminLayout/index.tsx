"use client";

import LucideIcon from "@components/Atoms/LucideIcon";
import { Card, CardContent } from "@components/Atoms/ui/card";
import { Toaster } from "@components/Atoms/ui/toaster";
// This client component only renders the content area (stats + children)

export default function AdminLayoutClient({
  dashboardStats,
  children,
}: Readonly<{
  children: React.ReactNode;
  dashboardStats: any;
}>) {

  // Map API data to stats array
  const topStats = dashboardStats ? [
    {
      title: dashboardStats.totalUsers?.title || "Tổng người dùng",
      icon: "Users",
      value: dashboardStats.totalUsers?.value?.toLocaleString("vi-VN") || "0",
      delta: dashboardStats.totalUsers?.change || "0% từ tháng trước",
    },
    {
      title: dashboardStats.webVisits?.title || "Lượt truy cập Web",
      icon: "Globe",
      value: dashboardStats.webVisits?.value?.toLocaleString("vi-VN") || "0",
      delta: dashboardStats.webVisits?.change || "0% từ tháng trước",
    },
    {
      title: dashboardStats.userNotPlay?.title || "Người chơi chưa chơi",
      icon: "UserX",
      value: dashboardStats.userNotPlay?.value || "0%",
      delta: dashboardStats.userNotPlay?.change || "0% so với tháng trước",
    },
    {
      title: dashboardStats.userPlay?.title || "Người chơi đã chơi",
      icon: "UserCheck",
      value: dashboardStats.userPlay?.value || "0%",
      delta: dashboardStats.userPlay?.change || "0% so với tháng trước",
    },
  ] : [];

  return (
    <>
      <main className="flex-1 overflow-y-auto p-4 md:p-6">
        {/* Top stats */}
        {topStats.length > 0 && (
          <div className="my-4 pb-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
            {topStats.map((s, i) => (
              <Card
                key={i}
                className="hover:shadow-md transition-shadow bg-admin-primary border-gray-300"
              >
                <CardContent className="p-4 md:p-8 min-h-44">
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-md font-bold text-gray-600 mb-2">
                        {s.title}
                      </p>

                      <div className={`p-3 rounded-lg`}>
                        <LucideIcon name={s.icon as any} iconSize={20} />
                      </div>
                    </div>
                    <div className="flex flex-col gap-1 pt-6">
                      <p className="text-2xl md:text-3xl font-bold text-gray-900">
                        {s.value}
                      </p>
                      <p className="text-xs text-gray-500">{s.delta}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
        {children}
      </main>
      <Toaster />
    </>
  );
}

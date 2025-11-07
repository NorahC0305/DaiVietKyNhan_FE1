import React from "react";
import HeaderActions from "./Components/HeaderActions";
import TopStats from "./Components/TopStats";
import MonthlyTable, { MonthlyStat } from "./Components/MonthlyTable";
import TopPlayers from "./Components/TopPlayers";
import CategoryStats from "./Components/CategoryStats";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/Atoms/ui/card";
import { ILandStatsData } from "@models/user/response";

const UserStatisticPage = () => {
  const monthlyData: MonthlyStat[] = [
    {
      month: 1,
      monthName: "Tháng 1",
      newUsers: 245,
      changePercent: 23,
      totalPlays: 1850,
      passRate: 85.2,
    },
    {
      month: 2,
      monthName: "Tháng 2",
      newUsers: 312,
      changePercent: -16,
      totalPlays: 2100,
      passRate: 78.5,
    },
    {
      month: 3,
      monthName: "Tháng 3",
      newUsers: 189,
      changePercent: 5,
      totalPlays: 2350,
      passRate: 82.1,
    },
  ];

  const landStatsData: ILandStatsData[] = [
    {
      landId: 1,
      landName: "Sơn Tinh",
      totalAnswers: 17,
      averagePoints: 667757,
      completionRate: 33.33,
    },
    {
      landId: 2,
      landName: "Chử Đồng Tử",
      totalAnswers: 1,
      averagePoints: 1060,
      completionRate: 0,
    },
    {
      landId: 3,
      landName: "Thánh Gióng",
      totalAnswers: 0,
      averagePoints: 0,
      completionRate: 0,
    },
    {
      landId: 4,
      landName: "Liễu Hạnh",
      totalAnswers: 0,
      averagePoints: 0,
      completionRate: 0,
    },
    {
      landId: 5,
      landName: "Kỳ Linh Diệt Hỏa",
      totalAnswers: 0,
      averagePoints: 0,
      completionRate: 0,
    },
  ];

  return (
    <div className="space-y-6">
      <Card className="border-gray-300 bg-admin-primary">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between gap-2">
            <div>
              <CardTitle className="text-lg md:text-xl font-semibold text-gray-900">
                Thông kê người dùng & lượt chơi
              </CardTitle>
              <div className="text-sm text-gray-500">
                Quản lý và theo dõi thống kê người dùng & lượt chơi
              </div>
            </div>
            {/* <HeaderActions /> */}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <TopStats />
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
            <MonthlyTable data={monthlyData} />
            <TopPlayers />
          </div>
          <CategoryStats data={landStatsData} />
        </CardContent>
      </Card>
    </div>
  );
};

export default UserStatisticPage;

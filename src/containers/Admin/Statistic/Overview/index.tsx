import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/Atoms/ui/card";
import { Progress } from "@/components/Atoms/ui/progress";
import HeaderBar from "./Components/HeaderBar";
import Kpis, { KpiItem } from "./Components/Kpis";
import EngagementReport, {
  EngagementItem,
} from "./Components/EngagementReport";
import PerformanceReport from "./Components/PerformanceReport";
import GrowthCards from "./Components/GrowthCards";

const StatisticOverViewPage = () => {
  const kpis: KpiItem[] = [
    {
      title: "Tỷ lệ tham gia",
      value: "94.2%",
      change: "+2.1% từ tháng trước",
      icon: "TrendingUp",
    },
    {
      title: "Điểm TB hệ thống",
      value: "785",
      change: "+15 điểm từ tháng trước",
      icon: "BadgeCheck",
    },
    {
      title: "Tương tác/ngày",
      value: "1,247",
      change: "+8.3% từ tuần trước",
      icon: "Activity",
    },
    {
      title: "Tỷ lệ quay lại",
      value: "68.5%",
      change: "+5.2% từ tháng trước",
      icon: "RefreshCw",
    },
  ];

  const engagements: EngagementItem[] = [
    { label: "Đăng nhập hằng ngày", value: 85 },
    { label: "Hoàn thành trò chơi", value: 78 },
    { label: "Chia sẻ nội dung", value: 45 },
    { label: "Gửi phản hồi", value: 32 },
  ];

  return (
    <div className="space-y-6">
      <Card className="border-gray-300 bg-admin-primary">
        <HeaderBar
          title="Báo cáo tổng hợp"
          description="Quản lý và theo dõi báo cáo tổng hợp"
        />
        <CardContent className="space-y-6">
          <Kpis items={kpis} />

          {/* Middle section */}
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
            <EngagementReport items={engagements} />
            <PerformanceReport
              score="A+"
              uptime="98.5%"
              metrics={[
                { label: "Tốc độ tải trang", value: "1.2s" },
                { label: "Tỷ lệ lỗi", value: "0.1%" },
                { label: "Độ hài lòng người dùng", value: "4.8/5" },
              ]}
            />
          </div>

          {/* Bottom growth cards */}
          <GrowthCards
            items={[
              { label: "Tăng trưởng người dùng", value: "+12%" },
              { label: "Tăng trưởng tương tác", value: "+18%" },
              { label: "Tăng trưởng nội dung", value: "+25%" },
            ]}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default StatisticOverViewPage;

import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/Atoms/ui/card";

interface Metric {
  label: string;
  value: string;
}

interface Props {
  score: string;
  uptime: string;
  metrics: Metric[];
}

const PerformanceReport = ({ score, uptime, metrics }: Props) => {
  return (
    <Card className="border-gray-300">
      <CardHeader>
        <CardTitle className="text-base">Báo cáo hiệu suất</CardTitle>
        <CardDescription>
          Đánh giá hiệu suất tổng thể của hệ thống
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-lg bg-[#fdf3e4] p-6 text-center">
            <div className="text-3xl font-semibold text-orange-600">
              {score}
            </div>
            <div className="mt-1 text-sm text-gray-600">Điểm tổng thể</div>
          </div>
          <div className="rounded-lg bg-[#fdf3e4] p-6 text-center">
            <div className="text-3xl font-semibold text-orange-600">
              {uptime}
            </div>
            <div className="mt-1 text-sm text-gray-600">Uptime</div>
          </div>
        </div>

        <div className="space-y-2 text-sm text-gray-700">
          {metrics?.map((m) => (
            <div key={m.label} className="flex items-center justify-between">
              <span>{m.label}</span>
              <span className="text-orange-600">{m.value}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default PerformanceReport;

import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/Atoms/ui/card";
import { Progress } from "@/components/Atoms/ui/progress";

export interface EngagementItem {
  label: string;
  value: number;
}

interface Props {
  items: EngagementItem[];
}

const EngagementReport = ({ items }: Props) => {
  return (
    <Card className="border-gray-300">
      <CardHeader>
        <CardTitle className="text-base">Báo cáo tương tác</CardTitle>
        <CardDescription>
          Phân tích chi tiết về mức độ tương tác của người dùng
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {items?.map((e) => (
          <div key={e.label} className="grid grid-cols-12 items-center gap-3">
            <div className="col-span-6 text-sm text-black">{e.label}</div>
            <div className="col-span-4">
              <Progress value={e.value} className="!h-2 bg-orange-100" />
            </div>
            <div className="col-span-2 text-right text-sm text-gray-700">
              {e.value}%
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default EngagementReport;

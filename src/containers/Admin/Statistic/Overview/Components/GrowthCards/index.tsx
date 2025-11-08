import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/Atoms/ui/card";

interface GrowthItem {
  label: string;
  value: string;
}

interface Props {
  items: GrowthItem[];
}

const GrowthCards = ({ items }: Props) => {
  return (
    <Card className="border-gray-300 bg-admin-primary">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Báo cáo tăng trưởng</CardTitle>
        <CardDescription>
          Xu hướng tăng trưởng và dự báo cho các tháng tới
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
          {items?.map((g) => (
            <Card key={g.label} className="border-gray-300">
              <CardContent className="flex flex-col items-center justify-center gap-1 p-6 text-center">
                <div className="text-xl font-semibold text-orange-600">
                  {g.value}
                </div>
                <div className="text-sm text-gray-700">{g.label}</div>
                <div className="text-xs text-gray-500">So với tháng trước</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default GrowthCards;

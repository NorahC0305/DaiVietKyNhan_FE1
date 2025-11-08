import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/Atoms/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/Atoms/ui/table";
import { Badge } from "@/components/Atoms/ui/badge";
import { IMonthlyUserStatsData } from "@models/user/response";

export interface MonthlyStat extends IMonthlyUserStatsData {}

interface Props {
  data: MonthlyStat[];
}

const MonthlyTable = ({ data }: Props) => {
  const getChangeBadgeClass = (value: number) => {
    if (value > 0) return "text-green-600";
    if (value < 0) return "text-red-600";
    return "text-muted-foreground";
  };

  return (
    <Card className="xl:col-span-2 border-gray-300">
      <CardHeader>
        <CardTitle className="text-base">
          Thống kê người dùng theo tháng
        </CardTitle>
        <CardDescription>
          Thống kê người dùng mới và lượt chơi theo tháng
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[120px]">Tháng</TableHead>
              <TableHead className="w-[180px] text-center">Người dùng mới</TableHead>
              <TableHead className="w-[120px] text-center">Tổng lượt chơi</TableHead>
              <TableHead className="w-[120px] text-center">Tỷ lệ hoàn thành (%)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="text-center text-sm text-muted-foreground"
                >
                  Không có dữ liệu
                </TableCell>
              </TableRow>
            ) : (
              data?.map((row) => (
                <TableRow key={row.month}>
                  <TableCell className="w-[120px] font-medium text-center">{row.monthName}</TableCell>
                  <TableCell className="w-[180px] text-center">
                    <div className="flex items-center justify-center">
                      <span>{row.newUsers.toLocaleString()}</span>
                      <Badge
                        variant="outline"
                        className={`border-0 ${getChangeBadgeClass(row.changePercent)} text-[10px] px-1 py-0 h-4`}
                      >
                        {row.changePercent > 0
                          ? `+${row.changePercent.toFixed(1)}%`
                          : row.changePercent < 0
                          ? `${row.changePercent.toFixed(1)}%`
                          : `${row.changePercent}%`}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell className="w-[120px] text-center">{row.totalPlays.toLocaleString()}</TableCell>
                  <TableCell className="w-[120px] text-center">
                    {row.passRate > 0 ? `${row.passRate.toFixed(1)}%` : `${row.passRate}%`}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default MonthlyTable;

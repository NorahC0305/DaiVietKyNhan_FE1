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
import { Progress } from "@/components/Atoms/ui/progress";
import { ILandStatsData } from "@models/user/response";

interface Props {
  data: ILandStatsData[];
}

const CategoryStats = ({ data }: Props) => {
  const getStatusStyle = (completionRate: number) => {
    if (completionRate >= 80) {
      return {
        backgroundColor: "#d86d37",
        color: "#ffffff",
        borderColor: "transparent",
      } as React.CSSProperties;
    }
    if (completionRate >= 50) {
      return {
        backgroundColor: "#f26644",
        color: "#ffffff",
        borderColor: "transparent",
      } as React.CSSProperties;
    }
    return {
      backgroundColor: "#6b7280",
      color: "#ffffff",
      borderColor: "transparent",
    } as React.CSSProperties;
  };

  const getStatusText = (completionRate: number) => {
    if (completionRate >= 80) return "Xuất sắc";
    if (completionRate >= 50) return "Tốt";
    return "Cần cải thiện";
  };
  return (
    <Card className="border-gray-300">
      <CardHeader>
        <CardTitle className="text-base">
          Thống kê theo danh mục trò chơi
        </CardTitle>
        <CardDescription>
          Hiệu suất và mức độ tham gia theo từng khu vực
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-center">Khu vực</TableHead>
              <TableHead className="text-center">Tổng lượt trả lời</TableHead>
              <TableHead className="text-center">Điểm TB</TableHead>
              <TableHead className="text-center">Tỷ lệ hoàn thành</TableHead>
              <TableHead className="text-center">Hiệu suất</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center text-sm text-muted-foreground"
                >
                  Không có dữ liệu
                </TableCell>
              </TableRow>
            ) : (
              data?.map((item) => (
                <TableRow key={item.landId}>
                  <TableCell className="font-medium text-center">
                    <Badge
                      variant="outline"
                      className="mr-2 bg-orange-100 text-admin-primary"
                    >
                      {item.landName}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    {item.totalAnswers.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-center">
                    <span>{item.averagePoints.toLocaleString()}</span>
                  </TableCell>
                  <TableCell className="text-center">
                    <span>{item.completionRate.toFixed(1)}%</span>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge
                      variant="outline"
                      style={getStatusStyle(item.completionRate)}
                    >
                      {getStatusText(item.completionRate)}
                    </Badge>
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

export default CategoryStats;

"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/Atoms/ui/card";
import LucideIcon from "@/components/Atoms/LucideIcon";
import userService from "@/services/user";
import { IUserPlayStatsResponseData } from "@/models/user/response";

interface StatItem {
  title: string;
  icon: string;
  value: string;
  change: string;
  changeClass: string;
}

const TopStats = () => {
  const [stats, setStats] = useState<IUserPlayStatsResponseData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUserPlayStats = async () => {
      try {
        setIsLoading(true);
        const response = await userService.getUserPlayStats();
        if (response?.data) {
          setStats(response.data);
        }
      } catch (error) {
        console.error("Error fetching user play stats:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserPlayStats();
  }, []);

  // Format number with thousand separator
  const formatNumber = (num: number) => {
    return num.toLocaleString("vi-VN");
  };

  // Format percentage change
  const formatPercentage = (rate: number) => {
    const sign = rate >= 0 ? "+" : "";
    const colorClass = rate >= 0 ? "text-green-600" : "text-red-600";
    return {
      text: `${sign}${rate}% từ tháng trước`,
      colorClass,
    };
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-4">
        {[1, 2].map((i) => (
          <Card key={i} className="bg-admin-primary border border-gray-300">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 w-4 bg-gray-200 rounded animate-pulse" />
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="h-8 w-16 bg-gray-200 rounded animate-pulse mb-2" />
              <div className="h-3 w-20 bg-gray-200 rounded animate-pulse" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-8 text-gray-500">
        Không thể tải dữ liệu thống kê
      </div>
    );
  }

  const userRateChange = formatPercentage(stats.ratemonthPre);
  const playRateChange = formatPercentage(stats.ratePlayPre);

  const data: StatItem[] = [
    {
      title: "Tổng người dùng",
      icon: "Users",
      value: formatNumber(stats.totalUser),
      change: userRateChange.text,
      changeClass: userRateChange.colorClass,
    },
    {
      title: "Tổng lượt chơi",
      icon: "PlayCircle",
      value: formatNumber(stats.totalPlays),
      change: playRateChange.text,
      changeClass: playRateChange.colorClass,
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4">
      {data?.map((item) => (
        <Card
          key={item.title}
          className="bg-admin-primary border border-gray-300"
        >
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {item.title}
              </CardTitle>
              <LucideIcon
                name={item.icon as any}
                iconSize={18}
                className="text-muted-foreground"
              />
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-2xl font-semibold">{item.value}</div>
            <CardDescription className={`mt-1 text-xs ${item.changeClass}`}>
              {item.change}
            </CardDescription>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default TopStats;
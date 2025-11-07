'use client'

import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/Atoms/ui/card";
import { Badge } from "@/components/Atoms/ui/badge";
import userService from "@/services/user";
import { ITopUserStatsData } from "@/models/user/response";

const TopPlayers = () => {
  const [topUsers, setTopUsers] = useState<ITopUserStatsData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchTopUsers = async () => {
      try {
        setIsLoading(true);
        const response = await userService.getTopUserStats();
        if (response?.data) {
          setTopUsers(response.data);
        }
      } catch (error) {
        console.error("Error fetching top user stats:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTopUsers();
  }, []);

  if (isLoading) {
    return (
      <Card className="border-gray-300">
        <CardHeader>
          <CardTitle className="text-base">Top người chơi</CardTitle>
          <CardDescription>
            Bảng xếp hạng người chơi xuất sắc nhất
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="flex items-center justify-between gap-4 rounded-lg border border-gray-300 p-3"
            >
              <div className="flex items-center gap-3">
                <div className="h-6 w-6 bg-gray-200 rounded animate-pulse" />
                <div>
                  <div className="h-4 w-32 bg-gray-200 rounded animate-pulse mb-1" />
                  <div className="h-3 w-24 bg-gray-200 rounded animate-pulse" />
                </div>
              </div>
              <div className="text-right">
                <div className="h-4 w-16 bg-gray-200 rounded animate-pulse mb-1" />
                <div className="h-3 w-8 bg-gray-200 rounded animate-pulse" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }
  return (
    <Card className="border-gray-300">
      <CardHeader>
        <CardTitle className="text-base">Top người chơi</CardTitle>
        <CardDescription>
          Bảng xếp hạng người chơi xuất sắc nhất
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {topUsers?.map((user, idx) => (
          <div
            key={user.userId}
            className="flex items-center justify-between gap-4 rounded-lg border border-gray-300 p-3"
          >
            <div className="flex items-center gap-3">
              <Badge
                variant="outline"
                className="h-6 w-6 items-center justify-center p-0 text-center bg-orange-100 text-admin-primary"
              >
                {idx + 1}
              </Badge>
              <div>
                <div className="text-sm font-medium">{user.name}</div>
                <div className="text-xs text-muted-foreground">
                  {user.totalAnswers} trò chơi · Tỷ lệ thắng {user.correctRate}%
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-md font-semibold">{user.currentPoints.toLocaleString()}</div>
              <div className="text-xs text-muted-foreground">điểm</div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default TopPlayers;

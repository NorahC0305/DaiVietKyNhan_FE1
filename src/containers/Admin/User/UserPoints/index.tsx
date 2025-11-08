"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/Atoms/ui/card";
import SummaryCards from "./Components/SummaryCards";
import EditForm from "./Components/EditForm";
import PointsTable from "./Components/PointsTable";
import userService from "@services/user";
import {
  IPointStatsResponseData,
  IPointChangeLogData,
} from "@models/user/response";

const data = [
  {
    id: "1",
    name: "Nguyễn Văn A",
    currentPoint: 850,
    lastChange: { delta: 50, date: "2024-03-10" },
  },
  {
    id: "2",
    name: "Trần Thị B",
    currentPoint: 720,
    lastChange: { delta: 50, date: "2024-03-10" },
  },
  {
    id: "3",
    name: "Lê Văn C",
    currentPoint: 650,
    lastChange: { delta: 50, date: "2024-03-10" },
  },
  {
    id: "4",
    name: "Phạm Thị D",
    currentPoint: 920,
    lastChange: { delta: 50, date: "2024-03-10" },
  },
];

const UserPointPage = () => {
  const [pointStats, setPointStats] = useState<IPointStatsResponseData | null>(
    null
  );
  const [pointLogs, setPointLogs] = useState<IPointChangeLogData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [editingLog, setEditingLog] = useState<IPointChangeLogData | null>(
    null
  );
  const [isLoadingLogs, setIsLoadingLogs] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [totalPage, setTotalPage] = useState<number>(1);
  const [totalItem, setTotalItem] = useState<number>(0);
  
  // Ref for EditForm to scroll to it when editing
  const editFormRef = React.useRef<HTMLDivElement>(null);

  // Fetch point stats from API
  const fetchPointStats = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await userService.getPointStats();
      if (response?.data) {
        setPointStats(response.data);
      }
    } catch (error) {
      console.error("Error fetching point stats:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch point change logs from API
  const fetchPointLogs = React.useCallback(async () => {
    setIsLoadingLogs(true);
    try {
      const response = await userService.getChangePointUserLogs({
        currentPage,
        pageSize,
      });
      if (response?.data?.results) {
        setPointLogs(response.data.results);
        if (response.data.pagination) {
          setTotalPage(response.data.pagination.totalPage);
          setTotalItem(response.data.pagination.totalItem);
        }
      }
    } catch (error) {
      console.error("Error fetching point logs:", error);
    } finally {
      setIsLoadingLogs(false);
    }
  }, [currentPage, pageSize]);

  useEffect(() => {
    fetchPointStats();
    fetchPointLogs();
  }, [fetchPointStats, fetchPointLogs]);

  const handleEditLog = React.useCallback((log: IPointChangeLogData) => {
    setEditingLog(log);
    
    // Scroll to EditForm after a brief delay to ensure it's rendered
    setTimeout(() => {
      if (editFormRef.current) {
        editFormRef.current.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }
    }, 100);
  }, []);

  const handleEditSuccess = React.useCallback(() => {
    setEditingLog(null);
    // Refresh both stats and logs
    fetchPointStats();
    fetchPointLogs();
  }, [fetchPointStats, fetchPointLogs]);

  const handleEditCancel = () => {
    setEditingLog(null);
  };

  // Use API data if available, otherwise fall back to calculated data
  const average = pointStats?.averagePoint
    ? Math.round(pointStats.averagePoint)
    : Math.round(
        data.reduce((acc, u) => acc + u.currentPoint, 0) / data.length
      );

  const highest =
    pointStats?.maxPoint || Math.max(...data.map((u) => u.currentPoint));

  const highUsers =
    pointStats?.totalUserLargePoint ||
    data.filter((u) => u.currentPoint >= 900).length;

  return (
    <div className="space-y-6">
      {/* Points overview and editor */}
      <Card className="border-gray-300 bg-admin-primary">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg md:text-xl font-semibold text-gray-900">
            Điểm số & chỉnh sửa điểm
          </CardTitle>
          <div className="text-sm text-gray-500">
            Quản lý và theo dõi điểm số, coin và heart của người dùng
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <SummaryCards
            average={average}
            highest={highest}
            highUsers={highUsers}
            isLoading={isLoading}
          />
          {editingLog && (
            <div ref={editFormRef}>
              <EditForm
                editingLog={editingLog}
                onSuccess={handleEditSuccess}
                onCancel={handleEditCancel}
              />
            </div>
          )}

          {/* Point logs table */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">
                Lịch sử thay đổi điểm số
              </h3>
              {isLoadingLogs && (
                <div className="text-sm text-gray-500">Đang tải...</div>
              )}
            </div>
            <PointsTable 
              pointLogs={pointLogs} 
              onEdit={handleEditLog}
              pagination={{ current: currentPage, pageSize, totalPage, totalItem }}
              onPageChange={(p) => setCurrentPage(p)}
              onPageSizeChange={(s) => { setPageSize(s); setCurrentPage(1); }}
              isLoading={isLoadingLogs}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserPointPage;

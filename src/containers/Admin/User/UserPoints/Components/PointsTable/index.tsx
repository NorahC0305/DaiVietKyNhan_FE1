"use client";

import React from "react";
import { Button } from "@/components/Atoms/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/Atoms/ui/table";
import LucideIcon from "@/components/Atoms/LucideIcon";
import { IPointChangeLogData } from "@models/user/response";

export type UserPoint = {
  id: string;
  name: string;
  currentPoint: number;
  lastChange: { delta: number; date: string };
};

type Pagination = {
  current: number;
  pageSize: number;
  totalPage: number;
  totalItem: number;
};

type Props = { 
  rows?: UserPoint[];
  pointLogs?: IPointChangeLogData[];
  onEdit?: (log: IPointChangeLogData) => void;
  pagination?: Pagination;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  isLoading?: boolean;
};

const PointsTable = ({ rows, pointLogs, onEdit, pagination, onPageChange, onPageSizeChange, isLoading }: Props) => {
  const formatDate = React.useCallback((dateString: string) => {
    return new Date(dateString).toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  }, []);

  // If we have point logs data, use that, otherwise fall back to rows
  if (pointLogs && pointLogs.length > 0) {
    return (
      <div className="rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Người dùng</TableHead>
              <TableHead>Điểm mới</TableHead>
              <TableHead>Coin mới</TableHead>
              <TableHead>Heart mới</TableHead>
              <TableHead>Lý do</TableHead>
              <TableHead>Ngày tạo</TableHead>
              <TableHead>Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pointLogs.map((log) => {
              const initial = log.user.name.split(" ")[0]?.[0] || log.user.email[0].toUpperCase();
              return (
                <TableRow key={log.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-xs font-semibold">
                        {initial}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{log.user.name}</div>
                        <div className="text-sm text-gray-500">{log.user.email}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="inline-flex items-center rounded-md bg-green-100 text-green-800 px-2 py-1 text-xs font-semibold">
                        {log.newPoint}
                      </span>
                      <span className="text-xs text-gray-500">Trước: {log.snapshotPoint}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="inline-flex items-center rounded-md bg-blue-100 text-blue-800 px-2 py-1 text-xs font-semibold">
                        {log.newCoin.toLocaleString()}
                      </span>
                      <span className="text-xs text-gray-500">Trước: {log.snapshotCoin.toLocaleString()}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="inline-flex items-center rounded-md bg-red-100 text-red-800 px-2 py-1 text-xs font-semibold">
                        {log.newHeart}
                      </span>
                      <span className="text-xs text-gray-500">Trước: {log.snapshotHeart}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-800 max-w-xs truncate" title={log.reason}>
                    {log.reason}
                  </TableCell>
                  <TableCell className="text-gray-600 text-sm">
                    {formatDate(log.createdAt)}
                  </TableCell>
                  <TableCell>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 px-2"
                      onClick={() => onEdit?.(log)}
                    >
                      <LucideIcon name="Edit" iconSize={16} />
                      <span className="ml-1">Chỉnh sửa</span>
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>

        {/* Pagination footer */}
        {pagination && (
          <div className="flex items-center justify-between mt-3 text-sm">
            <div className="text-gray-600">
              {isLoading ? "Đang tải..." : (
                <>
                  Hiển thị trang {pagination.current}/{pagination.totalPage} · Tổng {pagination.totalItem.toLocaleString()} bản ghi
                </>
              )}
            </div>
            <div className="flex items-center gap-2">
              <label className="text-gray-600">Mỗi trang</label>
              <select
                className="border rounded-md px-2 py-1 bg-white text-gray-700"
                value={pagination.pageSize}
                onChange={(e) => onPageSizeChange?.(Number(e.target.value))}
              >
                {[10,20,50,100].map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              <div className="ml-2 flex items-center gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8"
                  onClick={() => onPageChange?.(Math.max(1, (pagination.current - 1)))}
                  disabled={pagination.current <= 1 || isLoading}
                >
                  Trang trước
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8"
                  onClick={() => onPageChange?.(Math.min(pagination.totalPage, (pagination.current + 1)))}
                  disabled={pagination.current >= pagination.totalPage || isLoading}
                >
                  Trang sau
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Fallback to original rows format
  return (
    <div className="rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Người dùng</TableHead>
            <TableHead>Điểm hiện tại</TableHead>
            <TableHead>Thay đổi gần nhất</TableHead>
            <TableHead>Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows?.map((u) => {
            const initial = u.name.split(" ")[0][0];
            return (
              <TableRow key={u.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-xs font-semibold">
                      {initial}
                    </div>
                    <div className="font-medium text-gray-900">{u.name}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="inline-flex items-center rounded-md bg-[#D86D38]/20 text-white px-2 py-1 text-xs font-semibold">
                    {u.currentPoint}
                  </span>
                </TableCell>
                <TableCell className="text-gray-800">{`${u.lastChange.delta > 0 ? "+" : ""}${u.lastChange.delta} (${u.lastChange.date})`}</TableCell>
                <TableCell className="">
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <LucideIcon name="Edit" iconSize={18} />
                    Chỉnh sửa
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default PointsTable;



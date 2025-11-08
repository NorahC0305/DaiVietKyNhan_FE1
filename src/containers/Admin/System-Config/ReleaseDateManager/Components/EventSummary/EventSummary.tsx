"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@atoms/ui/card";
import { Label } from "@atoms/ui/label";
import {
  CalendarCheck,
  Clock,
  ToggleRight,
  ToggleLeft,
  FileText,
  Info,
} from "lucide-react";
import { formatVietnamTime } from "@utils/ReleaseDateUtils";

interface EventSummaryProps {
  releaseDate: ICOMPONENTS.ReleaseDateData;
  isCreatingNew: boolean;
  hasValidDate: boolean;
}

const EventSummary: React.FC<EventSummaryProps> = React.memo(
  ({ releaseDate, isCreatingNew, hasValidDate }) => {
    return (
      <Card className="lg:col-span-1 bg-white shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <div className="bg-orange-100 p-2 rounded-lg">
              <CalendarCheck className="h-5 w-5 text-orange-600" />
            </div>
            <span className="text-lg">
              {isCreatingNew ? "Sự Kiện Mới" : "Sự Kiện Đang Chọn"}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {hasValidDate ? (
            <div className="space-y-5">
              {/* Release Date */}
              <div className="flex items-start gap-4">
                <div className="bg-blue-100 p-2 rounded-full">
                  <Clock className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <Label className="text-gray-500">Thời gian ra mắt</Label>
                  <p className="font-mono text-lg font-semibold text-gray-800">
                    {releaseDate.date
                      ? formatVietnamTime(releaseDate.date, "HH:mm, dd/MM/yyyy")
                      : "Chưa có ngày"}
                  </p>
                </div>
              </div>

              {/* Status */}
              <div className="flex items-start gap-4">
                <div
                  className={`p-2 rounded-full ${
                    releaseDate.isActive ? "bg-green-100" : "bg-gray-100"
                  }`}
                >
                  {releaseDate.isActive ? (
                    <ToggleRight className="h-5 w-5 text-green-600" />
                  ) : (
                    <ToggleLeft className="h-5 w-5 text-gray-500" />
                  )}
                </div>
                <div>
                  <Label className="text-gray-500">Trạng thái thông báo</Label>
                  <div
                    className={`inline-flex items-center gap-1.5 px-3 py-1 mt-1 rounded-full text-xs font-medium ${
                      releaseDate.isActive
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    <div
                      className={`h-2 w-2 rounded-full ${
                        releaseDate.isActive ? "bg-green-500" : "bg-gray-400"
                      }`}
                    />
                    {releaseDate.isActive ? "Đã kích hoạt" : "Chưa kích hoạt"}
                  </div>
                </div>
              </div>

              {/* Description */}
              {releaseDate.description && (
                <div className="flex items-start gap-4">
                  <div className="bg-indigo-100 p-2 rounded-full">
                    <FileText className="h-5 w-5 text-indigo-600" />
                  </div>
                  <div>
                    <Label className="text-gray-500">Mô tả</Label>
                    <blockquote className="mt-1 border-l-4 border-gray-200 pl-4 text-sm text-gray-600 italic">
                      {releaseDate.description}
                    </blockquote>
                  </div>
                </div>
              )}
            </div>
          ) : (
            // "Not Set" State
            <div className="flex flex-col items-center justify-center text-center text-gray-500 h-40 bg-gray-50 rounded-lg">
              <Info className="h-8 w-8 text-gray-400 mb-2" />
              <p className="font-medium">
                {isCreatingNew ? "Đang tạo sự kiện mới" : "Chưa chọn sự kiện"}
              </p>
              <p className="text-sm">
                {isCreatingNew
                  ? "Điền thông tin và nhấn 'Tạo Mới' để lưu."
                  : "Chọn một sự kiện từ danh sách bên trái để xem chi tiết."}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }
);

EventSummary.displayName = "EventSummary";

export default EventSummary;

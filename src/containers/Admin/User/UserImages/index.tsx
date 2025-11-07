"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/Atoms/ui/card";
import Toolbar from "./components/Toolbar";
import SummaryCards from "./components/SummaryCards";
import ImagesTable from "./components/ImagesTable";

type ImageStatus = "approved" | "pending" | "rejected";

type ImageItem = {
  id: string;
  sender: string;
  title: string;
  submittedAt: string; // yyyy-mm-dd
  status: ImageStatus;
};

const sampleData: ImageItem[] = [
  {
    id: "1",
    sender: "Nguyễn Văn A",
    title: "Ảnh thiên nhiên",
    submittedAt: "2024-03-15",
    status: "approved",
  },
  {
    id: "2",
    sender: "Trần Thị B",
    title: "Ảnh gia đình",
    submittedAt: "2024-03-14",
    status: "pending",
  },
  {
    id: "3",
    sender: "Lê Văn C",
    title: "Ảnh du lịch",
    submittedAt: "2024-03-13",
    status: "rejected",
  },
];

const statusLabel: Record<ImageStatus, string> = {
  approved: "Đã duyệt",
  pending: "Chờ duyệt",
  rejected: "Từ chối",
};

const statusBadgeClass: Record<ImageStatus, string> = {
  approved: "bg-emerald-100 text-emerald-700 border-emerald-200",
  pending: "bg-orange-100 text-orange-700 border-orange-200",
  rejected: "bg-rose-100 text-rose-700 border-rose-200",
};

const UserImagePage = () => {
  const total = sampleData.length;
  const pending = sampleData.filter((i) => i.status === "pending").length;
  const approved = sampleData.filter((i) => i.status === "approved").length;

  return (
    <div className="space-y-6">
      <Card className="border-gray-300 bg-admin-primary">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg md:text-xl font-semibold text-gray-900">
            Hòm nộp ảnh
          </CardTitle>
          <div className="text-sm text-gray-500">
            Quản lý và theo dõi hòm nộp ảnh
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <Toolbar />
          <SummaryCards total={total} pending={pending} approved={approved} />
          <ImagesTable
            rows={sampleData}
            statusBadgeClass={statusBadgeClass}
            statusLabel={statusLabel}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default UserImagePage;

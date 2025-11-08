"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/Atoms/ui/card";
import Toolbar from "./Components/Toolbar";
import SummaryCards from "./Components/SummaryCards";
import MailsTable from "./Components/MailsTable";

type MailStatus = "unread" | "read" | "replied";

type MailItem = {
  id: string;
  sender: string;
  title: string;
  date: string; // yyyy-mm-dd
  status: MailStatus;
};

const mails: MailItem[] = [
  {
    id: "1",
    sender: "Nguyễn Văn A",
    title: "Góp ý về website",
    date: "2024-03-15",
    status: "unread",
  },
  {
    id: "2",
    sender: "Trần Thị B",
    title: "Cảm ơn đội ngũ",
    date: "2024-03-14",
    status: "read",
  },
  {
    id: "3",
    sender: "Phạm Thị D",
    title: "Đề xuất tính năng mới",
    date: "2024-03-13",
    status: "replied",
  },
];

const statusLabel: Record<MailStatus, string> = {
  unread: "Chưa đọc",
  read: "Đã đọc",
  replied: "Đã trả lời",
};

const statusBadgeClass: Record<MailStatus, string> = {
  unread: "bg-rose-100 text-rose-700 border-rose-200",
  read: "bg-orange-100 text-orange-700 border-orange-200",
  replied: "bg-emerald-100 text-emerald-700 border-emerald-200",
};

const UserMailPage = () => {
  const total = mails.length;
  const unread = mails.filter((m) => m.status === "unread").length;
  const read = mails.filter((m) => m.status === "read").length;
  const replied = mails.filter((m) => m.status === "replied").length;

  return (
    <div className="space-y-6">
      <Card className="border-gray-300 bg-admin-primary">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg md:text-xl font-semibold text-gray-900">
            Các bức thư được gửi về
          </CardTitle>
          <div className="text-sm text-gray-500">
            Quản lý và theo dõi các bức thư được gửi về
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <Toolbar />
          <SummaryCards
            total={total}
            unread={unread}
            read={read}
            replied={replied}
          />
          <MailsTable
            rows={mails}
            statusBadgeClass={statusBadgeClass}
            statusLabel={statusLabel}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default UserMailPage;

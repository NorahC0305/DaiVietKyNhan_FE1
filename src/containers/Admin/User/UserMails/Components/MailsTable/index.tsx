"use client";

import { Badge } from "@atoms/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@atoms/ui/table";
import { Button } from "@atoms/ui/button";
import LucideIcon from "@atoms/LucideIcon";

export type MailStatus = "unread" | "read" | "replied";

export type MailItem = {
  id: string;
  sender: string;
  title: string;
  date: string;
  status: MailStatus;
};

type Props = {
  rows: MailItem[];
  statusBadgeClass: Record<MailStatus, string>;
  statusLabel: Record<MailStatus, string>;
};

const getInitial = (name: string) => name.trim().charAt(0).toUpperCase();

const MailsTable = ({ rows, statusBadgeClass, statusLabel }: Props) => {
  return (
    <div className="rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Người gửi</TableHead>
            <TableHead>Tiêu đề</TableHead>
            <TableHead>Ngày gửi</TableHead>
            <TableHead>Trạng thái</TableHead>
            <TableHead>Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows?.map((m) => (
            <TableRow key={m.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-xs font-semibold">
                    {getInitial(m.sender)}
                  </div>
                  <div className="font-medium text-gray-900">{m.sender}</div>
                </div>
              </TableCell>
              <TableCell className="text-gray-900">{m.title}</TableCell>
              <TableCell className="text-gray-900">{m.date}</TableCell>
              <TableCell>
                <Badge variant="outline" className={statusBadgeClass[m.status]}>
                  {statusLabel[m.status]}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-3 text-gray-700">
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <LucideIcon name="Eye" iconSize={18} />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <LucideIcon name="Send" iconSize={18} />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <LucideIcon name="Trash2" iconSize={18} />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default MailsTable;

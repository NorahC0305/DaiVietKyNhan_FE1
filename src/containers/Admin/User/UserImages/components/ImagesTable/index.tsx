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

type ImageStatus = "approved" | "pending" | "rejected";

export type ImageItem = {
  id: string;
  sender: string;
  title: string;
  submittedAt: string;
  status: ImageStatus;
};

type Props = {
  rows: ImageItem[];
  statusBadgeClass: Record<ImageStatus, string>;
  statusLabel: Record<ImageStatus, string>;
};

const ImagesTable = ({ rows, statusBadgeClass, statusLabel }: Props) => {
  return (
    <div className="rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Ảnh</TableHead>
            <TableHead>Người gửi</TableHead>
            <TableHead>Tiêu đề</TableHead>
            <TableHead>Ngày gửi</TableHead>
            <TableHead>Trạng thái</TableHead>
            <TableHead>Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows?.map((item) => (
            <TableRow key={item.id}>
              <TableCell>
                <div className="h-9 w-9 rounded-md border border-gray-300 bg-white flex items-center justify-center text-gray-500">
                  <LucideIcon name="Image" iconSize={18} />
                </div>
              </TableCell>
              <TableCell className="text-gray-900">{item.sender}</TableCell>
              <TableCell className="text-gray-900">{item.title}</TableCell>
              <TableCell className="text-gray-800">{item.submittedAt}</TableCell>
              <TableCell>
                <Badge variant="outline" className={statusBadgeClass[item.status]}>
                  {statusLabel[item.status]}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <LucideIcon name="Eye" iconSize={18} />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <LucideIcon name="Download" iconSize={18} />
                  </Button>
                  {item.status === "pending" && (
                    <>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-emerald-600"
                      >
                        <LucideIcon name="Check" iconSize={18} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-rose-600"
                      >
                        <LucideIcon name="X" iconSize={18} />
                      </Button>
                    </>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ImagesTable;



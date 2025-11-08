"use client";

import React from "react";
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
import { Button } from "@/components/Atoms/ui/button";
import { Skeleton } from "@/components/Atoms/ui/skeleton";
import { EnhancedPagination } from "@/components/Atoms/ui/pagination";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/Atoms/ui/select";
import { Eye, Edit, Trash2, MoreHorizontal, Rows } from "lucide-react";
import { UIQuestion } from "@hooks/use-question-queries";
import { ILandEntity } from "@models/land/entity";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

interface QuestionsTableProps {
  lands: ILandEntity[];
  questions: UIQuestion[];
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  isLoading?: boolean;
  error?: any;
  pagination?: PaginationProps;
}

const QuestionsTable: React.FC<QuestionsTableProps> = ({
  lands,
  questions,
  onView,
  onEdit,
  onDelete,
  isLoading = false,
  error,
  pagination,
}) => {
  console.log(pagination);
  const getAnswerOptionTypeBadgeStyle = (answerOptionType: string) => {
    switch (answerOptionType) {
      case "ONE":
        return { backgroundColor: "#d86d37", color: "white" };
      case "TWO":
        return { backgroundColor: "#f26644", color: "white" };
      default:
        return { backgroundColor: "#d86d37", color: "white" };
    }
  };

  const getAnswerOptionTypeText = (answerOptionType: string) => {
    switch (answerOptionType) {
      case "ONE":
        return "Đơn lẻ";
      case "TWO":
        return "Cặp đôi";
      default:
        return "Đơn lẻ";
    }
  };

  const getStatusBadgeStyle = (status: string) => {
    switch (status) {
      case "active":
        return { backgroundColor: "#d86d37", color: "white" };
      case "draft":
        return {
          backgroundColor: "transparent",
          color: "#666",
          border: "1px solid #ccc",
        };
      default:
        return { backgroundColor: "#d86d37", color: "white" };
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "active":
        return "Hoạt động";
      case "draft":
        return "Bản nháp";
      default:
        return status;
    }
  };
  return (
    <div className="bg-admin-primary rounded-lg border border-gray-300">
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Danh sách câu hỏi
        </h3>
        <div className="overflow-x-auto custom-scrollbar-thin">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-semibold">Câu hỏi</TableHead>
                <TableHead className="font-semibold">Danh mục</TableHead>
                <TableHead className="font-semibold">Loại đáp án</TableHead>
                <TableHead className="font-semibold">Ngày tạo</TableHead>
                <TableHead className="font-semibold">Trạng thái</TableHead>
                <TableHead className="font-semibold">Tỷ lệ đúng</TableHead>
                <TableHead className="font-semibold">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                // Loading skeleton rows
                Array.from({ length: 5 }).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell><Skeleton className="h-4 w-full max-w-xs" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-16" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Skeleton className="h-8 w-8" />
                        <Skeleton className="h-8 w-8" />
                        <Skeleton className="h-8 w-8" />
                        <Skeleton className="h-8 w-8" />
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : error ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    <div className="text-red-500">
                      Có lỗi xảy ra khi tải dữ liệu: {error?.message || 'Không xác định'}
                    </div>
                  </TableCell>
                </TableRow>
              ) : questions?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    <div className="text-gray-500">
                      Không có câu hỏi nào
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                questions?.map((question) => (
                  <TableRow key={question.id}>
                    <TableCell className="font-medium max-w-xs">
                      <div className="truncate" dangerouslySetInnerHTML={{ __html: question.question as string }} />
                    </TableCell>
                    <TableCell>
                      <span className="border border-gray-300 rounded-full p-1 px-2">
                        {lands?.find((land) => land.id === Number(question.landId))?.name || "Chưa phân loại"}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge
                        style={getAnswerOptionTypeBadgeStyle(question.answerOptionType || "ONE")}
                        className="border-0"
                      >
                        {getAnswerOptionTypeText(question.answerOptionType || "ONE")}
                      </Badge>
                    </TableCell>
                    <TableCell>{question.createdAt}</TableCell>
                    <TableCell>
                      <Badge
                        style={getStatusBadgeStyle(question.status)}
                        className="border-0"
                      >
                        {getStatusText(question.status)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {question.rate > 0 ? (
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-600 font-bold">
                            {question.rate}%
                          </span>
                          <Progress
                            value={question.rate}
                            className="bg-white"
                            style={{ height: "8px", width: "80px" }}
                          />
                        </div>
                      ) : (
                        <span className="text-sm text-gray-500 font-bold">
                          Chưa có dữ liệu
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onView(question.id)}
                          className="h-8 w-8"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onEdit(question.id)}
                          className="h-8 w-8"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onDelete(question.id)}
                          className="h-8 w-8 text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
        
        {/* Pagination */}
        {pagination && (
          <div className="mt-4 flex flex-col lg:flex-row items-center justify-between gap-4">
            {/* Items per page selector */}
            <div className="flex items-center gap-2">
              <Select 
                value={String(pagination.pageSize)} 
                onValueChange={(value) => {
                  console.log('Select onValueChange called with:', value);
                  pagination.onPageSizeChange(Number(value));
                }}
              >
                <SelectTrigger className="w-[100px] bg-background border-border text-foreground h-9">
                  <Rows className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  {[10, 20, 50, 100].map(size => (
                    <SelectItem key={size} value={String(size)}>{size} / trang</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {/* Pagination component */}
            <EnhancedPagination
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              totalItems={pagination.totalItems}
              itemsPerPage={pagination.pageSize}
              onPageChange={pagination.onPageChange}
              showItemCount={true}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestionsTable;

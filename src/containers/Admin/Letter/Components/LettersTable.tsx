"use client";

import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/Atoms/ui/table";
import { Badge } from "@/components/Atoms/ui/badge";
import { Button } from "@/components/Atoms/ui/button";
import { Eye, Edit, ChevronUp, ChevronDown, ArrowUpDown } from "lucide-react";
import { ILetterEntity } from "@models/letter/entity";
import { EnhancedPagination } from "@/components/Atoms/ui/pagination";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/Atoms/ui/select";
import { Rows } from "lucide-react";
import { LETTER_ENUMS } from "@constants/letter";

interface LettersTableProps {
    rows?: ILetterEntity[];
    onViewLetter?: (letter: ILetterEntity) => void;
    onEditLetter?: (letter: ILetterEntity) => void;
    onSort?: (field: string) => void;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    isLoading?: boolean;
    pagination?: {
        currentPage: number;
        totalPages: number;
        totalItems: number;
        pageSize: number;
        onPageChange: (page: number) => void;
        onPageSizeChange: (size: number) => void;
    };
}

const LettersTable: React.FC<LettersTableProps> = ({
    rows = [],
    onViewLetter,
    onEditLetter,
    onSort,
    sortBy,
    sortOrder = 'desc',
    isLoading = false,
    pagination,
}) => {
    const handleSort = (field: string) => {
        onSort?.(field);
    };

    const SortIcon = ({ field }: { field: string }) => {
        if (sortBy !== field) {
            return <ArrowUpDown className="h-4 w-4 text-gray-400" />;
        }
        return sortOrder === 'asc'
            ? <ChevronUp className="h-4 w-4 text-gray-700" />
            : <ChevronDown className="h-4 w-4 text-gray-700" />;
    };
    const getStatusBadgeVariant = (status: string) => {
        switch (status) {
            case LETTER_ENUMS.LETTER_STATUS.PUBLIC:
                return "default";
            case LETTER_ENUMS.LETTER_STATUS.PENDING:
                return "secondary";
            case LETTER_ENUMS.LETTER_STATUS.REMOVE:
                return "destructive";
            default:
                return "outline";
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case LETTER_ENUMS.LETTER_STATUS.PUBLIC:
                return "Công khai";
            case LETTER_ENUMS.LETTER_STATUS.PENDING:
                return "Chờ duyệt";
            case LETTER_ENUMS.LETTER_STATUS.REMOVE:
                return "Đã xóa";
            default:
                return status;
        }
    };

    const formatDate = (dateString: string | Date) => {
        const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
        return date.toLocaleDateString("vi-VN", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    if (isLoading) {
        return (
            <div className="text-center py-8 text-gray-500">
                Đang tải dữ liệu...
            </div>
        );
    }

    if (!rows || rows.length === 0) {
        return (
            <div className="text-center py-8 text-gray-500">
                Không có dữ liệu để hiển thị
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="rounded-md border border-border bg-background">
                <Table>
                    <TableHeader>
                        <TableRow className="hover:bg-muted/50">
                            <TableHead
                                className="text-foreground font-medium cursor-pointer hover:bg-gray-50 select-none"
                                onClick={() => handleSort('id')}
                            >
                                <div className="flex items-center gap-2">
                                    ID
                                    <SortIcon field="id" />
                                </div>
                            </TableHead>
                            <TableHead className="text-foreground font-medium">Người gửi</TableHead>
                            <TableHead className="text-foreground font-medium">Từ</TableHead>
                            <TableHead className="text-foreground font-medium">Đến</TableHead>
                            <TableHead
                                className="text-foreground font-medium cursor-pointer hover:bg-gray-50 select-none"
                                onClick={() => handleSort('status')}
                            >
                                <div className="flex items-center gap-2">
                                    Trạng thái
                                    <SortIcon field="status" />
                                </div>
                            </TableHead>
                            <TableHead
                                className="text-foreground font-medium cursor-pointer hover:bg-gray-50 select-none"
                                onClick={() => handleSort('isFirstPublic')}
                            >
                                <div className="flex items-center gap-2">
                                    Lần đầu công khai
                                    <SortIcon field="isFirstPublic" />
                                </div>
                            </TableHead>
                            <TableHead
                                className="text-foreground font-medium cursor-pointer hover:bg-gray-50 select-none"
                                onClick={() => handleSort('createdAt')}
                            >
                                <div className="flex items-center gap-2">
                                    Ngày tạo
                                    <SortIcon field="createdAt" />
                                </div>
                            </TableHead>
                            <TableHead className="text-foreground font-medium">Hành động</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {rows.map((letter) => (
                            <TableRow key={letter.id} className="hover:bg-muted/50">
                                <TableCell className="text-foreground">{letter.id}</TableCell>
                                <TableCell className="text-foreground">
                                    <div className="flex items-center gap-2">
                                        {letter.fromUser?.avatar && (
                                            <img
                                                src={letter.fromUser.avatar}
                                                alt={letter.fromUser.name}
                                                className="w-8 h-8 rounded-full"
                                            />
                                        )}
                                        <span className="font-medium">{letter.fromUser?.name || `User ${letter.fromUserId}`}</span>
                                    </div>
                                </TableCell>
                                <TableCell className="text-foreground">
                                    {letter.from || "-"}
                                </TableCell>
                                <TableCell className="text-foreground">
                                    {letter.to || "-"}
                                </TableCell>
                                <TableCell className="text-foreground">
                                    <Badge variant={getStatusBadgeVariant(letter.status)}>
                                        {getStatusText(letter.status)}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-foreground">
                                    <Badge variant={letter.isFirstPublic ? "default" : "outline"}>
                                        {letter.isFirstPublic ? "Có" : "Không"}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-foreground">
                                    {formatDate(letter.createdAt)}
                                </TableCell>
                                <TableCell className="text-foreground">
                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => onViewLetter?.(letter)}
                                            className="h-8 w-8 p-0"
                                            title="Xem"
                                        >
                                            <Eye className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => onEditLetter?.(letter)}
                                            className="h-8 w-8 p-0"
                                            title="Sửa"
                                        >
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination */}
            {pagination && (
                <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
                    {/* Items per page selector */}
                    <div className="flex items-center gap-2">
                        <Select
                            value={String(pagination.pageSize)}
                            onValueChange={(value) => {
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
    );
};

export default LettersTable;


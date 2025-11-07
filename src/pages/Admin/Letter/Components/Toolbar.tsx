"use client";

import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/Atoms/ui/select";
import { Input } from "@/components/Atoms/ui/input";
import { Filter, ArrowUpDown } from "lucide-react";
import { LETTER_ENUMS } from "@constants/letter";

interface ToolbarProps {
    fromUserId: string;
    status: string;
    isFirstPublic: string;
    sortBy: string;
    sortOrder: string;
    onFromUserIdChange: (value: string) => void;
    onStatusChange: (value: string) => void;
    onIsFirstPublicChange: (value: string) => void;
    onSortChange: (sortBy: string, sortOrder: string) => void;
}

const Toolbar: React.FC<ToolbarProps> = ({
    fromUserId,
    status,
    isFirstPublic,
    sortBy,
    sortOrder,
    onFromUserIdChange,
    onStatusChange,
    onIsFirstPublicChange,
    onSortChange,
}) => {
    const sortOptions = [
        { value: "id", label: "ID" },
        { value: "status", label: "Trạng thái" },
        { value: "isFirstPublic", label: "Lần đầu công khai" },
        { value: "createdAt", label: "Ngày tạo" },
        { value: "updatedAt", label: "Ngày cập nhật" },
    ];

    const handleSortByChange = (value: string) => {
        onSortChange(value, sortOrder);
    };

    const handleSortOrderChange = (value: string) => {
        onSortChange(sortBy, value);
    };

    return (
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center flex-1">
                {/* From User ID Filter */}
                <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-gray-400" />
                    <Input
                        type="number"
                        placeholder="User ID"
                        value={fromUserId}
                        onChange={(e) => onFromUserIdChange(e.target.value)}
                        className="w-[150px] bg-background border-border text-foreground"
                    />
                </div>

                {/* Status Filter */}
                <div className="flex items-center gap-2">
                    <Select value={status} onValueChange={onStatusChange}>
                        <SelectTrigger className="w-[180px] bg-background border-border text-foreground">
                            <SelectValue placeholder="Trạng thái" />
                        </SelectTrigger>
                        <SelectContent className="bg-card border-border">
                            <SelectItem value="all">Tất cả trạng thái</SelectItem>
                            <SelectItem value={LETTER_ENUMS.LETTER_STATUS.PENDING}>Chờ duyệt</SelectItem>
                            <SelectItem value={LETTER_ENUMS.LETTER_STATUS.PUBLIC}>Công khai</SelectItem>
                            <SelectItem value={LETTER_ENUMS.LETTER_STATUS.REMOVE}>Đã xóa</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Is First Public Filter */}
                <div className="flex items-center gap-2">
                    <Select value={isFirstPublic} onValueChange={onIsFirstPublicChange}>
                        <SelectTrigger className="w-[180px] bg-background border-border text-foreground">
                            <SelectValue placeholder="Lần đầu công khai" />
                        </SelectTrigger>
                        <SelectContent className="bg-card border-border">
                            <SelectItem value="all">Tất cả</SelectItem>
                            <SelectItem value="true">Lần đầu công khai</SelectItem>
                            <SelectItem value="false">Không phải lần đầu</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Sort Section */}
            <div className="flex items-center gap-2 border-l border-gray-300 pl-4">
                <ArrowUpDown className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-600 font-medium whitespace-nowrap">Sắp xếp:</span>
                <Select value={sortBy} onValueChange={handleSortByChange}>
                    <SelectTrigger className="w-[140px] bg-background border-border text-foreground">
                        <SelectValue placeholder="Trường" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border">
                        {sortOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                                {option.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <Select value={sortOrder} onValueChange={handleSortOrderChange}>
                    <SelectTrigger className="w-[120px] bg-background border-border text-foreground">
                        <SelectValue placeholder="Thứ tự" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border">
                        <SelectItem value="desc">Giảm dần</SelectItem>
                        <SelectItem value="asc">Tăng dần</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
};

export default Toolbar;


"use client";

import React from "react";
import { Input } from "@/components/Atoms/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/Atoms/ui/select";
import { Button } from "@/components/Atoms/ui/button";
import { Filter, Download } from "lucide-react";

interface StatisticsHeaderProps {
  searchTerm: string;
  selectedCategory: string;
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onFilter: () => void;
  onExport: () => void;
}

const StatisticsHeader: React.FC<StatisticsHeaderProps> = ({
  searchTerm,
  selectedCategory,
  onSearchChange,
  onCategoryChange,
  onFilter,
  onExport,
}) => {
  const categories = [
    "Tất cả",
    "Địa lý",
    "Văn học",
    "Lịch sử",
    "Toán học",
    "Khoa học",
  ];

  return (
    <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center">
      <div className="flex flex-col sm:flex-row gap-4 flex-1">
        <div className="w-full sm:w-80">
          <Input
            size="sm"
            placeholder="Tìm kiếm câu hỏi..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="bg-transparent hover:bg-transparent"
          />
        </div>
        <div className="flex gap-4">
          <Select value={selectedCategory} onValueChange={onCategoryChange}>
            <SelectTrigger
              style={{ width: "200px" }}
              className="border-gray-300"
            >
              <SelectValue placeholder="Danh mục" />
            </SelectTrigger>
            <SelectContent>
              {categories?.map((category) => (
                <SelectItem
                  key={category}
                  value={category}
                  className="bg-admin-primary"
                >
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            onClick={onFilter}
            variant="outline"
            className="border-gray-300"
          >
            <Filter className="w-4 h-4 mr-2" />
            Lọc theo tỷ lệ
          </Button>
        </div>
      </div>
      <Button
        onClick={onExport}
        className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 ml-auto lg:ml-0"
      >
        <Download className="w-4 h-4 mr-2" />
        Xuất báo cáo
      </Button>
    </div>
  );
};

export default StatisticsHeader;

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
import { Plus } from "lucide-react";

interface SearchFiltersProps {
  searchTerm: string;
  selectedLandId?: number;
  onSearchChange: (value: string) => void;
  onLandIdChange: (value: string) => void;
  onAddQuestion: () => void;
  lands?: any[];
}

const SearchFilters: React.FC<SearchFiltersProps> = ({
  searchTerm,
  selectedLandId,
  onSearchChange,
  onLandIdChange,
  onAddQuestion,
  lands = [],
}) => {
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
            color="black"
          />
        </div>
        <div className="flex gap-4">
          <Select
            value={selectedLandId ? selectedLandId.toString() : "all"}
            onValueChange={onLandIdChange}
          >
            <SelectTrigger
              style={{ width: "200px" }}
              className="border-gray-300"
            >
              <SelectValue placeholder="Chọn vùng đất" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all" className="bg-admin-primary">
                Tất cả
              </SelectItem>
              {lands.map((land) => (
                <SelectItem
                  key={land.id}
                  value={land.id.toString()}
                  className="bg-admin-primary"
                >
                  {land.name || `Land ${land.id}`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <Button
        onClick={onAddQuestion}
        className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 ml-auto lg:ml-0"
      >
        <Plus className="w-4 h-4 mr-2" />
        Thêm câu hỏi mới
      </Button>
    </div>
  );
};

export default SearchFilters;

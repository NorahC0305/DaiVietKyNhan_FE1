"use client";

import { Button } from "@atoms/ui/button";
import { Input } from "@atoms/ui/input";
import LucideIcon from "@atoms/LucideIcon";
import { COLORS } from "@constants/colors";

const Toolbar = () => {
  return (
    <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
      <div className="flex flex-1 gap-3">
        <Input
          size="sm"
          placeholder="Tìm kiếm ảnh..."
          className="bg-transparent hover:bg-gray-100 text-black"
        />
        <Button variant="outline" className="gap-2 border-gray-300">
          <LucideIcon name="Filter" iconSize={16} />
          Lọc theo trạng thái
        </Button>
      </div>
      <Button
        className="gap-2"
        style={{ backgroundColor: COLORS.BACKGROUND.ORANGE }}
      >
        <LucideIcon name="Download" iconSize={16} />
        Tải xuống tất cả
      </Button>
    </div>
  );
};

export default Toolbar;

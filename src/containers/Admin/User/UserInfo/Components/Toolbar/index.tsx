"use client";

import { Button } from "@atoms/ui/button";
import { Input } from "@atoms/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@atoms/ui/select";
import LucideIcon from "@atoms/LucideIcon";
import { COLORS } from "@constants/colors";
import { USER } from "@constants/user";

interface ToolbarProps {
  onSearch: (value: string) => void;
  onStatusFilter: (value: string) => void;
  onStatisticsClick: () => void;
  onBehaviorStatsClick: () => void;
  searchValue: string;
  statusValue: string;
}

const Toolbar = ({ onSearch, onStatusFilter, onStatisticsClick, onBehaviorStatsClick, searchValue, statusValue }: ToolbarProps) => {
  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div className="flex-1 flex items-center gap-2">
        <div className="relative w-full max-w-sm">
          <Input
            size="sm"
            inputMode="search"
            placeholder="Tìm kiếm theo email..."
            className="bg-transparent hover:bg-transparent"
            color="black"
            value={searchValue}
            onChange={(e) => onSearch(e.target.value)}
          />
        </div>
        <Select value={statusValue || "all"} onValueChange={(value) => onStatusFilter(value === "all" ? "" : value)}>
          <SelectTrigger className="w-[140px] bg-background border-border text-foreground h-9">
            <SelectValue placeholder="Trạng thái" />
          </SelectTrigger>
          <SelectContent className="bg-card border-border">
            <SelectItem value="all">Tất cả</SelectItem>
            <SelectItem value={USER.USER_STATUS.ACTIVE}>Hoạt động</SelectItem>
            <SelectItem value={USER.USER_STATUS.INACTIVE}>Không hoạt động</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex gap-2 flex-wrap justify-end">
        <Button
          size="sm"
          variant="outline"
          className="gap-2"
          onClick={onStatisticsClick}
        >
          <LucideIcon name="BarChart3" iconSize={16} />
          Thống kê người dùng
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="gap-2"
          onClick={onBehaviorStatsClick}
        >
          <LucideIcon name="Activity" iconSize={16} />
          Hành vi sử dụng
        </Button>
        <Button
          size="sm"
          className="gap-2"
          style={{ backgroundColor: COLORS.BACKGROUND.ORANGE }}
        >
          <LucideIcon name="Plus" iconSize={16} />
          Thêm người dùng
        </Button>
      </div>
    </div>
  );
};

export default Toolbar;

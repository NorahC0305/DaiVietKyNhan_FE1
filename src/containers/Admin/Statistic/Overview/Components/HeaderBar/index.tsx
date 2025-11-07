import React from "react";
import { CardHeader, CardTitle } from "@/components/Atoms/ui/card";
import { Button } from "@/components/Atoms/ui/button";
import LucideIcon from "@/components/Atoms/LucideIcon";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/Atoms/ui/select";

interface Props {
  title: string;
  description: string;
}

const HeaderBar = ({ title, description }: Props) => {
  return (
    <CardHeader className="pb-3">
      <div className="flex items-center justify-between gap-2">
        <div>
          <CardTitle className="text-lg md:text-xl font-semibold text-gray-900">
            {title}
          </CardTitle>
          <div className="text-sm text-gray-500">{description}</div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-44">
            <Select defaultValue="tonghop">
              <SelectTrigger className="border-gray-300">
                <SelectValue placeholder="Loại báo cáo" />
              </SelectTrigger>
              <SelectContent className="bg-admin-primary border-gray-300">
                <SelectItem value="tonghop">Báo cáo tổng hợp</SelectItem>
                <SelectItem value="nguoidung">Báo cáo người dùng</SelectItem>
                <SelectItem value="tươngtac">Báo cáo tương tác</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="w-44">
            <Select defaultValue="30d">
              <SelectTrigger className="border-gray-300">
                <SelectValue placeholder="Khoảng thời gian" />
              </SelectTrigger>
              <SelectContent className="bg-admin-primary border-gray-300">
                <SelectItem value="7d">7 ngày qua</SelectItem>
                <SelectItem value="30d">30 ngày qua</SelectItem>
                <SelectItem value="90d">90 ngày qua</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button variant="outline" className="gap-2 border-gray-300">
            <LucideIcon name="Settings2" />
            Tùy chỉnh
          </Button>
          <Button variant="outline" className="gap-2 border-gray-300">
            <LucideIcon name="FileDown" />
            Xuất PDF
          </Button>
          <Button className="gap-2">
            <LucideIcon name="Send" />
            Gửi báo cáo
          </Button>
        </div>
      </div>
    </CardHeader>
  );
};

export default HeaderBar;

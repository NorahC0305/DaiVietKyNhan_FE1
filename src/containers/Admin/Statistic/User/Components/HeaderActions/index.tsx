import React from "react";
import { Button } from "@/components/Atoms/ui/button";
import LucideIcon from "@/components/Atoms/LucideIcon";

const HeaderActions = () => {
  return (
    <div className="flex items-center justify-end gap-2">
      <Button variant="outline" className="gap-2 border-gray-300">
        <LucideIcon name="Calendar" />
        Thời gian
      </Button>
      <Button variant="outline" className="gap-2 border-gray-300">
        <LucideIcon name="Settings2" />
        Lọc nâng cao
      </Button>
      <Button className="gap-2 border-gray-300">
        <LucideIcon name="FileDown" />
        Xuất báo cáo
      </Button>
    </div>
  );
};

export default HeaderActions;

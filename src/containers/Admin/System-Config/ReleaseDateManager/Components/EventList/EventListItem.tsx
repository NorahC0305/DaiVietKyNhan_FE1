"use client";

import React from "react";
import { Edit } from "lucide-react";
import { formatVietnamTime } from "@utils/ReleaseDateUtils";

interface EventListItemProps {
  event: ICOMPONENTS.ReleaseDateData;
  isSelected: boolean;
  onSelect: (event: ICOMPONENTS.ReleaseDateData) => void;
}

const EventListItem: React.FC<EventListItemProps> = React.memo(
  ({ event, isSelected, onSelect }) => (
    <div
      className={`py-5 p-3 cursor-pointer border-l-4 transition-colors bg-gray-200 rounded-xl ${
        isSelected
          ? "bg-orange-50 border-orange-500"
          : "hover:bg-gray-50 border-transparent"
      }`}
      onClick={() => onSelect(event)}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate">
            {event?.description || "Sự kiện không có mô tả"}
          </p>
          <p className="text-xs text-gray-500">
            {event?.date
              ? formatVietnamTime(event.date, "dd/MM/yyyy HH:mm")
              : "Chưa có ngày"}
          </p>
        </div>
        <div className="flex items-center gap-1">
          {event?.isActive && (
            <div className="w-2 h-2 bg-green-500 rounded-full" />
          )}
          <Edit className="h-3 w-3 text-gray-400" />
        </div>
      </div>
    </div>
  )
);

EventListItem.displayName = "EventListItem";

export default EventListItem;

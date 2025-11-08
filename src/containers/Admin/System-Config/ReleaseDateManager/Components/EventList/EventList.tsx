"use client";

import React from "react";
import { Button } from "@atoms/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@atoms/ui/card";
import { Calendar, Plus } from "lucide-react";
import EventListItem from "./EventListItem";

interface EventListProps {
  events: ICOMPONENTS.ReleaseDateData[];
  selectedEventId: number | null;
  onCreateNew: () => void;
  onSelectEvent: (event: ICOMPONENTS.ReleaseDateData) => void;
}

const EventList: React.FC<EventListProps> = React.memo(
  ({ events, selectedEventId, onCreateNew, onSelectEvent }) => {
    return (
      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Danh sách sự kiện
            </div>
            <Button
              size="sm"
              onClick={onCreateNew}
              className="bg-green-600 hover:bg-green-700"
            >
              <Plus className="h-4 w-4 mr-1" />
              Mới
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="max-h-96 overflow-y-auto">
            {events?.length > 0 ? (
              <div className="space-y-3">
                {events.map((event) => (
                  <EventListItem
                    key={event.id}
                    event={event}
                    isSelected={selectedEventId === event.id}
                    onSelect={onSelectEvent}
                  />
                ))}
              </div>
            ) : (
              <div className="p-6 text-center text-gray-500">
                <Calendar className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                <p className="text-sm">Chưa có sự kiện nào</p>
                <p className="text-xs">Nhấn "Mới" để tạo sự kiện đầu tiên</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }
);

EventList.displayName = "EventList";

export default EventList;

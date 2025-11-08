"use client";

import React from "react";
import { Calendar } from "lucide-react";
import { useReleaseDateManager } from "@hooks/useReleaseDateManager";
import ReleaseDateForm from "@containers/Admin/System-Config/ReleaseDateManager/Components/ReleaseDateForm";
import SystemStatusDashboard from "./Components/Countdown";
import EventList from "./Components/EventList";
import EventSummary from "./Components/EventSummary";

const ReleaseDateManager: React.FC = () => {
  const {
    releaseDate,
    allReleaseDates,
    selectedEventId,
    isCreatingNew,
    activeReleaseDate,
    activeReleaseEventData,
    isLoading,
    message,
    currentDateTime,
    isClient,
    hasValidDate,
    canSave,
    canDelete,
    setReleaseDate,
    handleSave,
    handleReset,
    handleCreateNew,
    handleSelectEvent,
    handleDelete,
  } = useReleaseDateManager();

  const handleDateChange = (date: Date | undefined) => {
    setReleaseDate((prev: ICOMPONENTS.ReleaseDateData) => ({ ...prev, date }));
  };

  const handleDescriptionChange = (description: string) => {
    setReleaseDate((prev: ICOMPONENTS.ReleaseDateData) => ({
      ...prev,
      description,
    }));
  };

  const handleActiveChange = (isActive: boolean) => {
    setReleaseDate((prev: ICOMPONENTS.ReleaseDateData) => ({
      ...prev,
      isActive,
    }));
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-3">
        <Calendar className="h-8 w-8 text-orange-600" />
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Quản lý Ngày Ra Mắt
          </h1>
          <p className="text-gray-600">
            Thiết lập và theo dõi thời gian ra mắt chính thức của hệ thống
          </p>
        </div>
      </div>

      {isClient && (
        <SystemStatusDashboard
          currentTime={currentDateTime}
          activeReleaseDate={activeReleaseDate}
          activeReleaseEventData={activeReleaseEventData}
        />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <EventList
          events={allReleaseDates}
          selectedEventId={selectedEventId}
          onCreateNew={handleCreateNew}
          onSelectEvent={handleSelectEvent}
        />

        <ReleaseDateForm
          releaseDate={releaseDate}
          isCreatingNew={isCreatingNew}
          isLoading={isLoading}
          message={message}
          canSave={canSave}
          canDelete={canDelete}
          onDateChange={handleDateChange}
          onDescriptionChange={handleDescriptionChange}
          onActiveChange={handleActiveChange}
          onSave={handleSave}
          onReset={handleReset}
          onDelete={handleDelete}
        />

        <EventSummary
          releaseDate={releaseDate}
          isCreatingNew={isCreatingNew}
          hasValidDate={hasValidDate}
        />
      </div>
    </div>
  );
};

export default ReleaseDateManager;
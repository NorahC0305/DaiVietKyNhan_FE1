"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/Atoms/ui/card";
import { Skeleton } from "@/components/Atoms/ui/skeleton";

interface SummaryCardsProps {
  totalQuestions: number;
  averageCorrectRate: number;
  isLoading?: boolean;
}

const SummaryCards: React.FC<SummaryCardsProps> = ({
  totalQuestions,
  averageCorrectRate,
  isLoading = false,
}) => {
  const cards = [
    {
      title: "Tổng câu hỏi",
      value: totalQuestions,
      icon: "📊",
    },
    {
      title: "Tỷ lệ đúng TB",
      value: `${averageCorrectRate}%`,
      icon: "📈",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {cards.map((card, index) => (
        <Card key={index} className="bg-admin-primary shadow-sm border border-gray-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              {card.title}
            </CardTitle>
            {card.icon && (
              <span className="text-2xl">{card.icon}</span>
            )}
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <div className="text-2xl font-bold text-gray-900">{card.value}</div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default SummaryCards;

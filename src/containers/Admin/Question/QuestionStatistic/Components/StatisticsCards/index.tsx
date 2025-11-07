"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/Atoms/ui/card";

interface StatisticsCardsProps {
  totalAnswers: number;
  averageCorrectRate: number;
  hardestQuestionRate: number;
  easiestQuestionRate: number;
}

const StatisticsCards: React.FC<StatisticsCardsProps> = ({
  totalAnswers,
  averageCorrectRate,
  hardestQuestionRate,
  easiestQuestionRate,
}) => {
  const cards = [
    {
      title: "Tổng lượt trả lời",
      value: totalAnswers?.toLocaleString(),
      icon: "📊",
      color: "text-orange-500",
    },
    {
      title: "Tỷ lệ đúng trung bình",
      value: `${averageCorrectRate}%`,
      icon: "📈",
      color: "text-orange-500",
    },
    {
      title: "Câu hỏi khó nhất",
      value: `${hardestQuestionRate}%`,
      icon: "❌",
      color: "text-red-500",
    },
    {
      title: "Câu hỏi dễ nhất",
      value: `${easiestQuestionRate}%`,
      icon: "✅",
      color: "text-orange-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards?.map((card, index) => (
        <Card
          key={index}
          className="bg-admin-primary shadow-sm border border-gray-200"
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              {card.title}
            </CardTitle>
            <span className="text-2xl">{card.icon}</span>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${card.color}`}>
              {card.value}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default StatisticsCards;

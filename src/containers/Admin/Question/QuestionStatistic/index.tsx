"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/Atoms/ui/card";
import StatisticsHeader from "./Components/Toolbar";
import StatisticsCards from "./Components/StatisticsCards";
import QuestionStats from "./Components/QuestionStats";

interface AnswerOption {
  text: string;
  percentage: number;
  count: number;
  isCorrect: boolean;
}

interface QuestionStat {
  id: string;
  question: string;
  category: string;
  totalAnswers: number;
  overallCorrectRate: number;
  options: AnswerOption[];
}

const QuestionStatistic = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tất cả");

  // Mock data - trong thực tế sẽ lấy từ API
  const [questions] = useState<QuestionStat[]>([
    {
      id: "1",
      question: "Thủ đô của Việt Nam là gì?",
      category: "Địa lý",
      totalAnswers: 1250,
      overallCorrectRate: 88,
      options: [
        { text: "Hà Nội", percentage: 88, count: 1100, isCorrect: true },
        { text: "TP.HCM", percentage: 6, count: 80, isCorrect: false },
        { text: "Đà Nẵng", percentage: 4, count: 45, isCorrect: false },
        { text: "Huế", percentage: 2, count: 25, isCorrect: false },
      ],
    },
    {
      id: "2",
      question: "Ai là tác giả của tác phẩm 'Truyện Kiều'?",
      category: "Văn học",
      totalAnswers: 890,
      overallCorrectRate: 81,
      options: [
        { text: "Nguyễn Du", percentage: 81, count: 720, isCorrect: true },
        { text: "Hồ Xuân Hương", percentage: 11, count: 95, isCorrect: false },
        { text: "Nguyễn Trãi", percentage: 5, count: 45, isCorrect: false },
        { text: "Lý Thường Kiệt", percentage: 3, count: 30, isCorrect: false },
      ],
    },
  ]);

  const handleFilter = () => {
    console.log("Filter by rate");
  };

  const handleExport = () => {
    console.log("Export report");
  };

  const filteredQuestions = questions.filter((question) => {
    const matchesSearch = question.question
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "Tất cả" || question.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  // Mock statistics data
  const totalAnswers = 15420;
  const averageCorrectRate = 84.5;
  const hardestQuestionRate = 45;
  const easiestQuestionRate = 95;

  return (
    <div className="space-y-6">
      <Card className="border-gray-300 bg-admin-primary">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg md:text-xl font-semibold text-gray-900">
            Thống kê tỷ lệ trả lời
          </CardTitle>
          <div className="text-sm text-gray-500">
            Quản lý và theo dõi thống kê tỷ lệ trả lời
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Header with search and filters */}
          <StatisticsHeader
            searchTerm={searchTerm}
            selectedCategory={selectedCategory}
            onSearchChange={setSearchTerm}
            onCategoryChange={setSelectedCategory}
            onFilter={handleFilter}
            onExport={handleExport}
          />

          {/* Summary Cards */}
          <StatisticsCards
            totalAnswers={totalAnswers}
            averageCorrectRate={averageCorrectRate}
            hardestQuestionRate={hardestQuestionRate}
            easiestQuestionRate={easiestQuestionRate}
          />

          {/* Question Statistics */}
          <QuestionStats questions={filteredQuestions} />
        </CardContent>
      </Card>
    </div>
  );
};

export default QuestionStatistic;

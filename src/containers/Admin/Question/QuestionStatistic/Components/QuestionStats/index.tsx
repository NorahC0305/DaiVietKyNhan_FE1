"use client";

import React from "react";
import { Card, CardContent } from "@/components/Atoms/ui/card";
import { Progress } from "@/components/Atoms/ui/progress";
import { Check, CheckCircle, X, XCircle } from "lucide-react";

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

interface QuestionStatsProps {
  questions: QuestionStat[];
}

const QuestionStats: React.FC<QuestionStatsProps> = ({ questions }) => {
  return (
    <div className="space-y-6">
      {questions?.map((question) => (
        <Card
          key={question.id}
          className="bg-admin-primary border border-gray-200"
        >
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {question.question}
                </h3>
                <div className="flex items-center gap-4 mb-3">
                  <span className="border border-gray-300 rounded-full px-3 py-1 text-sm text-black">
                    {question.category}
                  </span>
                  <span className="text-sm text-black">
                    Tổng: {question.totalAnswers.toLocaleString()} lượt trả lời
                  </span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-orange-500 mb-1">
                  {question.overallCorrectRate}%
                </div>
                <span className="text-sm text-black">Tỷ lệ đúng</span>
              </div>
            </div>

            <div className="space-y-3">
              {question.options?.map((option, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    {option.isCorrect ? (
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                    )}
                    <span className="text-sm text-gray-700 truncate">
                      {option.text}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="flex-1 min-w-0">
                      <Progress
                        value={option.percentage}
                        className="bg-[#f9e6d2]"
                        style={{ height: "8px", width: "120px" }}
                      />
                    </div>
                    <div className="text-right min-w-0">
                      <div className="text-sm font-medium text-gray-900">
                        {option.percentage}%
                      </div>
                      <div className="text-xs text-gray-500">
                        ({option.count})
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default QuestionStats;

"use client";

import { useState, useEffect, useCallback } from "react";
import questionService, { IQuestionStats } from "@services/question";
import { IQuestionResponse } from "@models/question/response";
import { ICreateQuestionRequest } from "@models/question/request";
import { IQuestion } from "@models/question/entity";
import { toast } from "react-toastify";

// UI Question interface
export interface UIQuestion {
  id: string;
  question: string;
  landId: string;
  type: string;
  answerOptionType?: string;
  createdAt: string;
  status: "active" | "draft";
  rate: number;
}

// Transform question data to UI format
const transformQuestionToUI = (question: any): UIQuestion => {
  try {
    // Handle createdAt which might be string or Date
    let createdAt = "";
    if (question.createdAt) {
      if (question.createdAt instanceof Date) {
        createdAt = question.createdAt.toLocaleDateString("vi-VN");
      } else {
        // Handle string date
        const date = new Date(question.createdAt);
        if (!isNaN(date.getTime())) {
          createdAt = date.toLocaleDateString("vi-VN");
        } else {
          createdAt = question.createdAt; // fallback to original string
        }
      }
    }

    return {
      id: question.id?.toString() || "",
      question: question.text || "",
      landId: question.landId?.toString() || "",
      type:
        question.questionType === "TEXT_INPUT"
          ? "Tự Luận"
          : question.questionType || "",
      answerOptionType: question.answerOptionType || "ONE",
      createdAt,
      status: question.deletedAt ? "draft" : "active",
      rate: question.rate || 0, // Use the rate from API response
    };
  } catch (error) {
    console.error("Error transforming question:", error, question);
    // Return a fallback question object
    return {
      id: question.id?.toString() || "unknown",
      question: question.text || "Unknown question",
      landId: question.landId?.toString() || "",
      type: "Tự Luận",
      answerOptionType: question.answerOptionType || "ONE",
      createdAt: new Date().toLocaleDateString("vi-VN"),
      status: "active",
      rate: question.rate || 0,
    };
  }
};

// Hook to get all questions
export const useQuestions = (params?: {
  currentPage?: number;
  pageSize?: number;
  search?: string;
  landId?: string;
  type?: string;
}) => {
  const [data, setData] = useState<UIQuestion[]>([]);
  const [rawData, setRawData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [pagination, setPagination] = useState<{ current: number; pageSize: number; totalPage: number; totalItem: number } | null>(null);

  const fetchQuestions = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await questionService.getAllQuestionsAdmin({
        currentPage: params?.currentPage,
        pageSize: params?.pageSize,
        search: params?.search,
        landId: params?.landId,
      });
      console.log(response);
      // Handle different possible response structures
      let questionsData = null;

      // Case 1: response.data.results (pagination structure)
      if (response.data?.results && Array.isArray(response.data.results)) {
        questionsData = response.data.results;
        if (response.data.pagination) {
          setPagination(response.data.pagination);
        } else {
          setPagination(null);
        }
      }
      // Case 2: response.data is array directly
      else if (Array.isArray(response.data)) {
        questionsData = response.data;
        setPagination(null);
      }
      // Case 3: response is array directly (as shown in the image)
      else if (Array.isArray(response)) {
        questionsData = response;
        setPagination(null);
      }

      if (questionsData && Array.isArray(questionsData)) {
        setRawData(questionsData);
        setData(questionsData.map(transformQuestionToUI));
      } else {
        setRawData([]);
        setData([]);
      }
    } catch (error) {
      console.error("Error fetching questions:", error);
      setError(error as Error);
    } finally {
      setIsLoading(false);
    }
  }, [params?.currentPage, params?.pageSize, params?.search, params?.landId, params?.type]);

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  const refetch = useCallback(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  return {
    data,
    rawData,
    isLoading,
    error,
    refetch,
    pagination,
  };
};

// Hook to create a new question
export const useCreateQuestion = () => {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutate = useCallback(
    async (
      data: ICreateQuestionRequest,
      options?: {
        onSuccess?: () => void;
        onError?: (error: Error) => void;
      }
    ) => {
      setIsPending(true);
      setError(null);

      try {
        const response = await questionService.createQuestion(data);
        console.log("response create question", response);
        toast.success("Tạo câu hỏi thành công");
        options?.onSuccess?.();
        return response.data;
      } catch (err) {
        const error = err as Error;
        setError(error);
        toast.error("Không thể tạo câu hỏi");
        options?.onError?.(error);
        throw error;
      } finally {
        setIsPending(false);
      }
    },
    []
  );

  return {
    mutate,
    isPending,
    error,
  };
};

// Hook to update a question
export const useUpdateQuestion = () => {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutate = useCallback(
    async (
      id: number,
      data: ICreateQuestionRequest,
      options?: {
        onSuccess?: () => void;
        onError?: (error: Error) => void;
      }
    ) => {
      setIsPending(true);
      setError(null);

      try {
        const response = await questionService.updateQuestion(id, data);
        toast.success("Cập nhật câu hỏi thành công");
        options?.onSuccess?.();
        return response.data;
      } catch (err) {
        const error = err as Error;
        setError(error);
        toast.error("Không thể cập nhật câu hỏi");
        options?.onError?.(error);
        throw error;
      } finally {
        setIsPending(false);
      }
    },
    []
  );

  return {
    mutate,
    isPending,
    error,
  };
};

// Hook to get a ONE question by ID
export const useGetQuestionById = (id: number | null) => {
  const [data, setData] = useState<IQuestion | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchQuestion = useCallback(async () => {
    if (!id) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await questionService.getQuestionById(id);
      if (response.statusCode === 200 && response.data) {
        setData(response.data);
      } else {
        setError(new Error("Failed to fetch question"));
      }
    } catch (err) {
      const error = err as Error;
      setError(error);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchQuestion();
  }, [fetchQuestion]);

  return {
    data,
    isLoading,
    error,
    refetch: fetchQuestion,
  };
};

// Hook to get questions statistics from BE
export const useQuestionStats = () => {
  const [data, setData] = useState<IQuestionStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchStats = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await questionService.getQuestionStats();

      if (response.statusCode === 200 && response.data) {
        setData(response.data);
      } else {
        setError(
          new Error(response.message || "Failed to fetch question stats")
        );
      }
    } catch (err) {
      const error = err as Error;
      setError(error);
      console.error("Error fetching question stats:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const refetch = useCallback(() => {
    fetchStats();
  }, [fetchStats]);

  return {
    data,
    isLoading,
    error,
    refetch,
  };
};

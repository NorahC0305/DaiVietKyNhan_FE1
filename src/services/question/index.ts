import http from "@configs/fetch";
import { IQuestion } from "@models/question/entity";
import { ICreateQuestionRequest } from "@models/question/request";
import {
  ICreateQuestionResponse,
  IQuestionResponse,
} from "@models/question/response";

// Question stats interface
interface IQuestionStats {
  countQuestion: number;
  rateCorrect: number;
}

interface IQuestionStatsResponse {
  statusCode: number;
  data: IQuestionStats;
  message: string;
}

const questionService = {
  // Create a new question
  createQuestion: async (data: ICreateQuestionRequest) => {
    return await http.post<ICreateQuestionResponse>(`/question`, data);
  },

  // Get all questions with server-side pagination and optional filters
  getAllQuestionsAdmin: async (params?: { currentPage?: number; pageSize?: number; search?: string; landId?: string | number }) => {
    const queryParts: string[] = [];
    if (params?.currentPage) queryParts.push(`currentPage=${encodeURIComponent(String(params.currentPage))}`);
    if (params?.pageSize) queryParts.push(`pageSize=${encodeURIComponent(String(params.pageSize))}`);
    if (params?.search) queryParts.push(`search=${encodeURIComponent(params.search)}`);
    if (params?.landId !== undefined && params?.landId !== null && params?.landId !== "all") {
      queryParts.push(`landId=${encodeURIComponent(String(params.landId))}`);
    }
    const query = queryParts.length ? `?${queryParts.join("&")}` : "";
    return await http.get<IQuestionResponse>(`/question${query}`);
  },

  // Get a single question by ID
  getQuestionById: async (id: number) => {
    return await http.get<ICreateQuestionResponse>(`/question/${id}`);
  },
  updateQuestion: async (id: number, data: ICreateQuestionRequest) => {
    return await http.put<IQuestionResponse>(`/question/${id}`, data);
  },
  deleteQuestion: async (questionId: number) => {
    return await http.delete<IQuestionResponse>(`/question/${questionId}`, {});
  },
  
  // Get questions statistics
  getQuestionStats: async () => {
    return await http.get<IQuestionStatsResponse>('/dashboard/questions/stats');
  },
};

export default questionService;

// Export interfaces for use in hooks
export type { IQuestionStats, IQuestionStatsResponse };

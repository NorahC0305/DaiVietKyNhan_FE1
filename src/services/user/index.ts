import http from "@configs/fetch";
import { IQueryRequest } from "@models/common/request";
import {
  IUpdateMeBodySchema,
  IUpdateUserPointsRequest,
} from "@models/user/request";
import {
  IPointStatsResponse,
  IPointChangeLogPaginationResponse,
  IUserPlayStatsResponse,
  ITopUserStatsResponse,
  IMonthlyUserStatsResponse,
  ILandStatsResponse,
  IUserRankResponse,
  IUserDemographicsStatsResponse,
} from "@models/user/response";
import qs from "qs";

const userService = {
  getMe: async () => {
    return await http.get("/auth/me", {
      next: { tags: ["userProfile"] },
    });
  },
  getUsers: async (
    params?: IQueryRequest & { sortBy?: string; sortOrder?: "asc" | "desc" }
  ) => {
    const qsParts: string[] = [];

    // Handle sorting
    if (params?.sortBy && params?.sortOrder) {
      const prefix = params.sortOrder === "desc" ? "-" : "";
      qsParts.push(`sort:${prefix}${params.sortBy}`);
    } else {
      // Default sort
      qsParts.push("sort:-createdAt", "sort:-status");
    }

    if (params?.status) {
      qsParts.push(`status=${params.status}`);
    }

    if (params?.search) {
      // Search only by email field
      qsParts.push(`email:like=${params.search}`);
    }

    const qsValue = qsParts.join(",");

    const finalParams = {
      qs: qsValue,
      currentPage: params?.page,
      pageSize: params?.limit,
    };

    const queryString = qs.stringify(finalParams, {
      skipNulls: true,
    });

    return await http.get(`/user/user-list?${queryString}`, {
      next: { tags: ["modifyUser"] },
    });
  },
  updateMe: async (data: IUpdateMeBodySchema) => {
    return await http.put("/auth/me", data);
  },
  getPointStats: async () => {
    return await http.get<IPointStatsResponse>("/dashboard/point/stats", {
      next: { tags: ["pointStats"] },
    });
  },
  getChangePointUserLogs: async (params?: {
    qs?: string;
    currentPage?: number;
    pageSize?: number;
  }) => {
    const queryString = qs.stringify(
      {
        qs: params?.qs || "sort:-createdAt",
        currentPage: params?.currentPage || 1,
        pageSize: params?.pageSize || 10,
      },
      { skipNulls: true }
    );

    return await http.get<IPointChangeLogPaginationResponse>(
      `/change-point-user-log?${queryString}`,
      {
        next: { tags: ["changePointUserLog"] },
      }
    );
  },
  updateUserPoints: async (data: IUpdateUserPointsRequest) => {
    return await http.post("/change-point-user-log", data, {
      next: { tags: ["changePointUserLog"] },
    });
  },
  getUserPlayStats: async () => {
    return await http.get<IUserPlayStatsResponse>(
      "/dashboard/user-play/stats",
      {
        next: { tags: ["userPlayStats"] },
      }
    );
  },
  getTopUserStats: async () => {
    return await http.get<ITopUserStatsResponse>(
      "/dashboard/user-play/top-user/stats",
      {
        next: { tags: ["topUserStats"] },
      }
    );
  },
  getMonthlyUserStats: async () => {
    return await http.get<IMonthlyUserStatsResponse>(
      "/dashboard/user-play/months",
      {
        next: { tags: ["monthlyUserStats"] },
      }
    );
  },
  getLandStats: async () => {
    return await http.get<ILandStatsResponse>(
      "/dashboard/user-play/land/stats",
      {
        next: { tags: ["landStats"] },
      }
    );
  },
  addHeart: async () => {
    return await http.put("/user/add-heart", null, {
      next: { tags: ["addHeart"] },
    });
  },
  getUserRank: async (params?: {
    currentPage?: number;
    pageSize?: number;
  }) => {
    const page = params?.currentPage ?? 1;
    const size = params?.pageSize ?? 15;
    const queryParams = qs.stringify({
      currentPage: page,
      pageSize: size,
    });

    const url = `/user/user-rank?${queryParams}`;
    if (typeof window !== 'undefined') {
    }

    // Public endpoint - do not require auth
    const res = await http.getPublic<IUserRankResponse>(url, {
      next: { tags: ["userRank"] },
    });

    return res;
  },
  getUserDemographicsStats: async (): Promise<IUserDemographicsStatsResponse> => {
    // Mock API - Replace with actual API call later
    // return await http.get<IUserDemographicsStatsResponse>("/user/birthday-and-gender-stats");

    return {
      statusCode: 200,
      message: "Lấy thông tin thành công",
      data: {
        genders: {
          male: {
            amount: 126,
            percent: 23.42
          },
          female: {
            amount: 119,
            percent: 22.12
          },
          other: {
            amount: 293,
            percent: 54.46
          }
        },
        ages: {
          "0-17": {
            amount: 70,
            percent: 13.01
          },
          "18-24": {
            amount: 261,
            percent: 48.51
          },
          "25-34": {
            amount: 194,
            percent: 36.06
          },
          "35-50": {
            amount: 7,
            percent: 1.3
          },
          "50+": {
            amount: 3,
            percent: 0.56
          }
        }
      }
    };
  },
};

export default userService;

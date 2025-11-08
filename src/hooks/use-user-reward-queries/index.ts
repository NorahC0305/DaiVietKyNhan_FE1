"use client";

import { useQuery, queryOptions } from "@tanstack/react-query";
import userRewardService from "@services/user-reward";
import rewardService from "@services/reward";
import { IUserRewardPaginationResponse, IRewardCodeResponse } from "@models/user-reward/response";

export interface UseUserRewardsParams {
    qs?: string;
    currentPage?: number;
    pageSize?: number;
}

// Query keys
export const userRewardKeys = {
    all: ["userRewards"] as const,
    lists: () => [...userRewardKeys.all, "list"] as const,
    list: (params?: UseUserRewardsParams) => [...userRewardKeys.lists(), params] as const,
    giftCodes: (type: "CODE" | "COIN" | "POINT") => [...userRewardKeys.all, "giftCodes", type] as const,
};

// Query options factory function for user rewards
export const getUserRewardsQueryOptions = (params?: UseUserRewardsParams) => {
    return queryOptions({
        queryKey: userRewardKeys.list(params),
        queryFn: async () => {
            try {
                const response = await userRewardService.getUserRewards({
                    currentPage: params?.currentPage,
                    pageSize: params?.pageSize,
                    qs: params?.qs,
                }) as IUserRewardPaginationResponse;

                if (response.statusCode === 200 && response.data) {
                    return response.data;
                }
                throw new Error(response.message || "Failed to fetch user rewards");
            } catch (error) {
                console.error("Error fetching user rewards:", error);
                throw error;
            }
        },
        staleTime: 30 * 1000, // 30 seconds
    });
};

// Query options factory function for gift codes
export const getGiftCodesQueryOptions = (type: "CODE" | "COIN" | "POINT" = "CODE") => {
    return queryOptions({
        queryKey: userRewardKeys.giftCodes(type),
        queryFn: async () => {
            try {
                const response = await rewardService.getGiftCodes(type) as IRewardCodeResponse;

                if (response.statusCode === 200 && response.data) {
                    return response.data;
                }
                throw new Error(response.message || "Failed to fetch gift codes");
            } catch (error) {
                console.error("Error fetching gift codes:", error);
                throw error;
            }
        },
        staleTime: 5 * 60 * 1000, // 5 minutes (gift codes don't change often)
    });
};

// Default query options for SSR prefetch
export const userRewardsOptions = getUserRewardsQueryOptions({
    qs: "sort:-id",
    currentPage: 1,
    pageSize: 10,
});

export const giftCodesOptions = getGiftCodesQueryOptions("CODE");


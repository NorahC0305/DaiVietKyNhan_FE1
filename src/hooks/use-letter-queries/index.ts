"use client";

import { useQuery, useMutation, useQueryClient, queryOptions } from "@tanstack/react-query";
import letterService from "@services/letter";
import { ILetterResponseModel } from "@models/letter/response";
import { ILetterEntity, LetterSchema } from "@models/letter/entity";
import { ISendLetterRequest, IUpdateLetterStatusRequest } from "@models/letter/request";
import { toast } from "react-toastify";
import { IBackendResponse } from "@models/backend";

export interface UseLettersParams {
    qs?: string;
    currentPage?: number;
    pageSize?: number;
}

// Query keys
export const letterKeys = {
    all: ["letters"] as const,
    lists: () => [...letterKeys.all, "list"] as const,
    list: (params?: UseLettersParams) => [...letterKeys.lists(), params] as const,
    details: () => [...letterKeys.all, "detail"] as const,
    detail: (id: number) => [...letterKeys.details(), id] as const,
};

// Query options factory function
export const getLetterQueryOptions = (params?: UseLettersParams) => {
    return queryOptions({
        queryKey: letterKeys.list(params),
        queryFn: async () => {
            try {
                const response = await letterService.getLetters(
                    params?.qs,
                    params?.currentPage,
                    params?.pageSize
                ) as ILetterResponseModel;

                if (response.statusCode === 200 && response.data) {
                    return response.data;
                }
                throw new Error(response.message || "Failed to fetch letters");
            } catch (error) {
                console.error("Error fetching letters:", error);
                throw error;
            }
        },
        staleTime: 30 * 1000, // 30 seconds
    });
};

// Default query options for SSR prefetch
// This matches the initial state in LetterPage component
export const letterOptions = getLetterQueryOptions({
    qs: "sort:-id",
    currentPage: 1,
    pageSize: 10,
});

// Query options factory function for single letter
export const getLetterByIdQueryOptions = (letterId: number) => {
    return queryOptions({
        queryKey: letterKeys.detail(letterId),
        queryFn: async () => {
            try {
                const response = await letterService.getLetterById(letterId) as IBackendResponse<typeof LetterSchema>;

                if (response.statusCode === 200 && response.data) {
                    return response.data as ILetterEntity;
                }
                throw new Error(response.message || "Failed to fetch letter");
            } catch (error) {
                console.error("Error fetching letter:", error);
                throw error;
            }
        },
        enabled: !!letterId && letterId > 0,
        staleTime: 30 * 1000, // 30 seconds
    });
};

// Hook to update a letter
export const useUpdateLetter = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            letterId,
            data,
        }: {
            letterId: number;
            data: Partial<ISendLetterRequest & { status?: string }>;
        }) => {
            const response = await letterService.updateLetter(letterId, data) as IBackendResponse<any>;

            if (response.statusCode === 200 || response.statusCode === 201) {
                return { ...response, letterId, data };
            }
            throw new Error(response.message || "Failed to update letter");
        },
        // Optimistic update
        onMutate: async ({ letterId, data }) => {
            // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
            await queryClient.cancelQueries({ queryKey: letterKeys.all });

            // Snapshot the previous value for all queries
            const previousQueries: Array<[any, any]> = [];

            // Update all matching queries optimistically
            queryClient.getQueriesData({ queryKey: letterKeys.lists() }).forEach(([queryKey, queryData]) => {
                if (queryData) {
                    // Save previous state
                    previousQueries.push([queryKey, queryData]);

                    // Optimistically update
                    const updatedData = queryData as ILetterResponseModel['data'];
                    if (updatedData?.results) {
                        queryClient.setQueryData(queryKey, {
                            ...updatedData,
                            results: updatedData.results.map((letter: ILetterEntity) =>
                                letter.id === letterId
                                    ? { ...letter, ...data, status: data.status as typeof letter.status }
                                    : letter
                            ),
                        });
                    }
                }
            });

            // Return a context object with the snapshotted value
            return { previousQueries };
        },
        // If the mutation fails, use the context returned from onMutate to roll back
        onError: (error: Error, variables, context) => {
            // Rollback all queries
            if (context?.previousQueries) {
                context.previousQueries.forEach(([queryKey, data]) => {
                    queryClient.setQueryData(queryKey, data);
                });
            }
            console.error("Error updating letter:", error);
            toast.error(error.message || "Không thể cập nhật thư");
        },
        // Always refetch after error or success to ensure data consistency
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: letterKeys.all });
        },
        onSuccess: () => {
            toast.success("Cập nhật thư thành công!");
        },
    });
};

// Hook to send a letter
export const useSendLetter = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: ISendLetterRequest) => {
            const response = await letterService.sendLetter(data);
            return response;
        },
        onSuccess: () => {
            // Invalidate and refetch letters queries
            queryClient.invalidateQueries({ queryKey: letterKeys.all });
            toast.success("Gửi thư thành công!");
        },
        onError: (error: Error) => {
            console.error("Error sending letter:", error);
            toast.error(error.message || "Không thể gửi thư");
        },
    });
};

// Hook to update multiple letter statuses
export const useUpdateLetterStatus = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: IUpdateLetterStatusRequest) => {
            const response = await letterService.updateLetterStatus(data) as IBackendResponse<any>;

            if (response.statusCode === 200 || response.statusCode === 201) {
                return response;
            }
            throw new Error(response.message || "Failed to update letter status");
        },
        // Optimistic update
        onMutate: async ({ letters, status }) => {
            // Cancel any outgoing refetches
            await queryClient.cancelQueries({ queryKey: letterKeys.all });

            // Snapshot the previous value for all queries
            const previousQueries: Array<[any, any]> = [];
            const letterIds = letters.map(l => l.letterId);

            // Update all matching queries optimistically
            queryClient.getQueriesData({ queryKey: letterKeys.lists() }).forEach(([queryKey, queryData]) => {
                if (queryData) {
                    // Save previous state
                    previousQueries.push([queryKey, queryData]);

                    // Optimistically update
                    const updatedData = queryData as ILetterResponseModel['data'];
                    if (updatedData?.results) {
                        queryClient.setQueryData(queryKey, {
                            ...updatedData,
                            results: updatedData.results.map((letter: ILetterEntity) =>
                                letterIds.includes(letter.id)
                                    ? { ...letter, status: status as typeof letter.status }
                                    : letter
                            ),
                        });
                    }
                }
            });

            // Return a context object with the snapshotted value
            return { previousQueries };
        },
        // If the mutation fails, use the context returned from onMutate to roll back
        onError: (error: Error, variables, context) => {
            // Rollback all queries
            if (context?.previousQueries) {
                context.previousQueries.forEach(([queryKey, data]) => {
                    queryClient.setQueryData(queryKey, data);
                });
            }
            console.error("Error updating letter status:", error);
            toast.error(error.message || "Không thể cập nhật trạng thái thư");
        },
        // Always refetch after error or success to ensure data consistency
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: letterKeys.all });
        },
        onSuccess: (_, variables) => {
            toast.success(`Cập nhật trạng thái ${variables.letters.length} thư thành công!`);
        },
    });
};


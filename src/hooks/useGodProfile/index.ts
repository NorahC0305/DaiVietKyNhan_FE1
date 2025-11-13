import { queryOptions } from "@tanstack/react-query";
import godProfileService from "@services/god-profile";
import { IGodRankingResponseModel } from "@models/god-profile/response";
import { IGodRanking } from "@models/god-profile/entity";

const baseKey = ["god-profile"] as const;

export const godProfileKeys = {
    ranking: () =>
        queryOptions({
            queryKey: [...baseKey, "ranking"] as const,
            queryFn: async (): Promise<IGodRanking[]> => {
                const resp =
                    (await godProfileService.godRanking()) as IGodRankingResponseModel;
                const items = resp?.data?.items;
                return Array.isArray(items) ? items : [];
            },
            staleTime: 30 * 1000,
        }),
};


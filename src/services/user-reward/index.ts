import http from "@configs/fetch";
import qs from "qs";

const userRewardService = {
    getUserRewards: async (params?: {
        currentPage?: number;
        pageSize?: number;
        qs?: string;
    }) => {
        const queryParams = qs.stringify({
            currentPage: params?.currentPage,
            pageSize: params?.pageSize,
            qs: params?.qs,
        });
        return await http.get(`/user-reward-history?${queryParams}`, {
            cache: "no-store",
        });
    },
};

export default userRewardService;
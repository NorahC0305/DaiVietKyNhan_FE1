export const dynamic = 'force-dynamic';
import UserGiftCode from "@pages/Admin/User/UserGiftCode";
import rewardService from "@services/reward";
import userRewardService from "@services/user-reward";
import { IRewardCodeResponse, IUserRewardPaginationResponse } from "@models/user-reward/response";

async function getGiftCodes(): Promise<IRewardCodeResponse> {
    try {
        const giftCodes = await rewardService.getGiftCodes("CODE");
        return giftCodes as IRewardCodeResponse;
    } catch (error) {
        console.error("Error fetching gift codes:", error);
        return {
            statusCode: 200,
            data: [],
            message: "Success"
        };
    }
}

async function getUserRewards(): Promise<IUserRewardPaginationResponse> {
    try {
        const userRewards = await userRewardService.getUserRewards({
            qs: "reward.code:=LYNHATTON,status=COMPLETED",
            currentPage: 1,
            pageSize: 10,
        });
        console.log(userRewards);
        return userRewards as IUserRewardPaginationResponse;
    } catch (error) {
        console.error("Error fetching user rewards:", error);
        return {
            statusCode: 200,
            message: "Success",
            data: {
                results: [],
                pagination: {
                    current: 1,
                    pageSize: 10,
                    totalPage: 0,
                    totalItem: 0
                }
            }
        };
    }
}

export default async function GiftCodePage() {
    const [giftCodes, userRewards] = await Promise.all([
        getGiftCodes(),
        getUserRewards()
    ]);

    return (
        <>
            <UserGiftCode
                giftCodes={giftCodes}
                initialUserRewardsResponse={userRewards}
            />
        </>
    );
}

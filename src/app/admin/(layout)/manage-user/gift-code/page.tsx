export const dynamic = 'force-dynamic';
import UserGiftCode from "@containers/Admin/User/UserGiftCode";
import { getQueryClient } from "@lib/get-query-client";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { userRewardsOptions, giftCodesOptions } from "@hooks/use-user-reward-queries";

export default async function GiftCodePage() {
    const queryClient = getQueryClient();

    try {
        // Prefetch both queries in parallel
        await Promise.all([
            queryClient.prefetchQuery(userRewardsOptions),
            queryClient.prefetchQuery(giftCodesOptions),
        ]);
    } catch (error) {
        console.error("Failed to prefetch gift code data:", error);
    }

    const dehydratedState = dehydrate(queryClient);

    return (
        <HydrationBoundary state={dehydratedState}>
            <UserGiftCode />
        </HydrationBoundary>
    );
}

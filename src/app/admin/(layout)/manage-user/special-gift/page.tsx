import SpecialGiftClient from "@containers/Admin/User/SpecialGift";
import { getQueryClient } from "@lib/get-query-client";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { specialGiftOptions } from "@hooks/useRewards";

export default async function SpecialGift() {

    const queryClient = getQueryClient();

    try {
        await queryClient.prefetchQuery(
            specialGiftOptions({ currentPage: 1, pageSize: 20 })
        );
    } catch (error) {
        console.error("Failed to prefetch special gift data:", error);
    }

    const dehydratedState = dehydrate(queryClient);
    return (
        <>
            <HydrationBoundary state={dehydratedState}>
                <SpecialGiftClient />
            </HydrationBoundary>
        </>
    )
}
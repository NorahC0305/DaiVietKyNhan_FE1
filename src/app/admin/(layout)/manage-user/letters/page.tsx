import { letterOptions } from "@hooks/use-letter-queries";
import { getQueryClient } from "@lib/get-query-client";
import LetterPage from "@containers/Admin/Letter";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

export const dynamic = 'force-dynamic';

export default async function LetterServer() {
    const queryClient = getQueryClient();

    try {
        await queryClient.prefetchQuery(letterOptions);
    } catch (error) {
        console.error("Failed to prefetch letters:", error);
    }
    const dehydratedState = dehydrate(queryClient);

    return (
        <HydrationBoundary state={dehydratedState}>
            <LetterPage />
        </HydrationBoundary>
    );
}
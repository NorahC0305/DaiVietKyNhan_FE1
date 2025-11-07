import { ILetterResponseModel } from "@models/letter/response";
import LetterPage from "@containers/Admin/Letter";
import letterService from "@services/letter";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient } from "@lib/get-query-client";

export const dynamic = 'force-dynamic';

async function getLetters() {
    const qs = "sort:-id";
    return await letterService.getLetters(qs, 1, 10);
}

export default async function LetterServer() {
    const queryClient = getQueryClient();
    
    const letters = await getLetters() as ILetterResponseModel;
    return (
        <>
            <HydrationBoundary state={dehydrate(queryClient)}>
                <LetterPage letters={letters?.data} />
            </HydrationBoundary>
        </>
    );
}
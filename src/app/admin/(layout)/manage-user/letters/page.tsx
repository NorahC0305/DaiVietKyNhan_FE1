import { ILetterResponseModel } from "@models/letter/response";
import LetterPage from "@containers/Admin/Letter";
import letterService from "@services/letter";

export const dynamic = 'force-dynamic';

async function getLetters() {
    const qs = "sort:-id";
    return await letterService.getLetters(qs, 1, 10);
}

export default async function LetterServer() {
    const letters = await getLetters() as ILetterResponseModel;
    return (
        <>
            <LetterPage letters={letters?.data} />
        </>
    );
}
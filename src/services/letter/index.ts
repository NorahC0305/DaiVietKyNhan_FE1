import http from "@configs/fetch";
import { ISendLetterRequest, IUpdateLetterStatusRequest } from "@models/letter/request";

const letterService = {
    sendLetter: async (data: ISendLetterRequest) => {
        return await http.post("/letter", data, { cache: "no-store" });
    },
    getLetters: async (qs?: string, currentPage?: number, pageSize?: number) => {
        const parts: string[] = [];
        if (qs && qs.length > 0) {
            parts.push(`qs=${encodeURIComponent(qs)}`);
        }
        if (currentPage !== undefined) {
            parts.push(`currentPage=${currentPage}`);
        }
        if (pageSize !== undefined) {
            parts.push(`pageSize=${pageSize}`);
        }
        const queryString = parts.length ? `?${parts.join("&")}` : "";
        const url = `/letter${queryString}`;

        return await http.get(url, { cache: "no-store" });
    },
    updateLetter: async (letterId: number, data: Partial<ISendLetterRequest & { status?: string }>) => {
        return await http.put(`/letter/${letterId}`, data);
    },
    updateLetterStatus: async (data: IUpdateLetterStatusRequest) => {
        return await http.put("/letter/status", data);
    }
};

export default letterService;
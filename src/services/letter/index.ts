import http from "@configs/fetch";
import { ISendLetterRequest } from "@models/letter/request";

const letterService = {
    sendLetter: async (data: ISendLetterRequest) => {
        return await http.post(`/letter`, data);
    },
};

export default letterService;
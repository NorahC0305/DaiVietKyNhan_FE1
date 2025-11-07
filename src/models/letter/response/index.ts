import { BackendPaginationResponseModel } from "@models/backend";
import { LetterSchema } from "../entity";
import z from "zod";

/**
 * Letter response schema
 */
export const LetterResponseModel = BackendPaginationResponseModel(LetterSchema);
export type ILetterResponseModel = z.infer<typeof LetterResponseModel>;
//-------------------End-------------------//
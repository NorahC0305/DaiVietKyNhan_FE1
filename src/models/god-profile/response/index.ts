import { BackendResponseModel } from "@models/backend";
import { GodProfileSchema, GodRankingSchema } from "../entity";
import { z } from "zod";

export const GodProfileResponseModel = BackendResponseModel(GodProfileSchema);
export type IGodProfileResponseModel = z.infer<typeof GodProfileResponseModel>;

/**
 * God ranking response model
 */
export const GodRankingResponseModel = BackendResponseModel(
    z.object({
        items: z.array(GodRankingSchema),
    })
);
export type IGodRankingResponseModel = z.infer<typeof GodRankingResponseModel>;
//----------------------End----------------------//
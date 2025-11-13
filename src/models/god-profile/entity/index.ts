import { TEST_ANSWER } from "@constants/test-answer"
import { z } from "zod";

export const GodProfileSchema = z.object({
    id: z.number(),
    title: z.string(),
    textEmotion: z.string(),
    order: z.number(),
    traitType: z.enum([TEST_ANSWER.TEST_QUESTION_HOME_TRAIT_TYPE.CHOLERIC, TEST_ANSWER.TEST_QUESTION_HOME_TRAIT_TYPE.SANGUINE, TEST_ANSWER.TEST_QUESTION_HOME_TRAIT_TYPE.MELANCHOLIC, TEST_ANSWER.TEST_QUESTION_HOME_TRAIT_TYPE.PHLEGMATIC]),
    description: z.string(),
    imgUrl: z.string(),
    text_color: z.string(),
    createdById: z.number(),
    updatedById: z.number(),
    deletedById: z.number().nullable(),
    deletedAt: z.coerce.date().nullable(),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
    isAchieved: z.boolean(),
    point: z.number(),
});
export type IGodProfile = z.infer<typeof GodProfileSchema>;


/**
 * God ranking response
 */
export const GodRankingSchema = z.object({
    name: z.string(),
    img: z.string(),
    points: z.number(),
    rank: z.number(),
});
export type IGodRanking = z.infer<typeof GodRankingSchema>;
//----------------------End----------------------//
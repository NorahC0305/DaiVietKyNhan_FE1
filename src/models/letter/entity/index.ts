import { LETTER_ENUMS } from "@constants/letter";
import z from "zod";

/**
 * Letter schema
 */
export const LetterSchema = z.object({
    id: z.number(),
    fromUserId: z.number(),
    from: z.string(),
    to: z.string(),
    content: z.string(),
    status: z.enum([LETTER_ENUMS.LETTER_STATUS.PENDING, LETTER_ENUMS.LETTER_STATUS.PUBLIC, LETTER_ENUMS.LETTER_STATUS.REMOVE]),
    isFirstPublic: z.boolean(),
    createdAt: z.date(),
    updatedAt: z.date(),
    deletedAt: z.date().nullable(),
    deletedById: z.number().nullable(),
    fromUser: z.object({
        id: z.number(),
        name: z.string(),
        avatar: z.string().nullable(),
    }),
});

export type ILetterEntity = z.infer<typeof LetterSchema>;
//-------------------End-------------------//
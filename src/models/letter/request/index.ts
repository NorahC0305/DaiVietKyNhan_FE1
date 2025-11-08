import z from "zod";

/**
 * Send letter request schema
 */
export const SendLetterRequestSchema = z.object({
    from: z.string().min(1, "'Từ' không được để trống"),
    to: z.string().min(1, "'Đến' không được để trống"),
    content: z.string().min(1, "Nội dung không được để trống"),
});

export type ISendLetterRequest = z.infer<typeof SendLetterRequestSchema>;
//-------------------End-------------------//

/**
 * Update letter status request schema
 */
export const UpdateLetterStatusRequestSchema = z.object({
    letters: z.array(z.object({
        letterId: z.number(),
        fromUserId: z.number(),
    })),
    status: z.string(),
});

export type IUpdateLetterStatusRequest = z.infer<typeof UpdateLetterStatusRequestSchema>;
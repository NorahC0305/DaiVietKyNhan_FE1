import { z } from "zod";

export const RewardSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string(),
  requireValue: z.number(),
  gift: z.string(),
  code: z.string().nullable(),
  type: z.enum(["CODE", "COIN", "POINT"]),
  limit: z.number().nullable(),
  startDate: z.string().nullable(),
  endDate: z.string().nullable(),
  isActive: z.boolean(),
  imageUrl: z.string().nullable(),
  createdById: z.number().nullable(),
  updatedById: z.number().nullable(),
  deletedById: z.number().nullable(),
  deletedAt: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type IReward = z.infer<typeof RewardSchema>;

export const RewardListResponseSchema = z.array(RewardSchema);
export type IRewardListResponse = z.infer<typeof RewardListResponseSchema>;

// User Reward Exchange Schema
export const UserRewardExchangeSchema = z.object({
  id: z.number(),
  userId: z.number(),
  rewardId: z.number(),
  status: z.enum(["COMPLETED", "PENDING","COMPLETED"]),
  exchangedAt: z.string().nullable(),
  code: z.string().nullable(),
  valuePaid: z.number(),
  createdById: z.number(),
  updatedById: z.number().nullable(),
  deletedById: z.number().nullable(),
  deletedAt: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
  reward: RewardSchema,
});

export type IUserRewardExchange = z.infer<typeof UserRewardExchangeSchema>;

export const UserRewardExchangeListResponseSchema = z.array(UserRewardExchangeSchema);
export type IUserRewardExchangeListResponse = z.infer<typeof UserRewardExchangeListResponseSchema>;

export const ExchangeRewardRequestSchema = z.object({
  rewardId: z.number(),
});

export type IExchangeRewardRequest = z.infer<typeof ExchangeRewardRequestSchema>;

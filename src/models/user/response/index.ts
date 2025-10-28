
import { USER } from "@constants/user"
import { roleModel } from "@models/role/model"
import { BackendResponseModel, BackendPaginationResponseModel } from "@models/backend"
import z from "zod"

const loginResponse = z.object({
    accessToken: z.string(),
    refreshToken: z.string(),
    id: z.number(),
    name: z.string(),
    email: z.string(),
    status: z.enum([USER.USER_STATUS.ACTIVE, USER.USER_STATUS.INACTIVE]),
    phoneNumber: z.string(),
    roleId: z.number(),
    avatar: z.string(),
    role: roleModel,
})
export type ILoginResponse = z.infer<typeof loginResponse>
//----------------------End----------------------//

const meResponseData = z.object({
    id: z.number(),
    email: z.string(),
    name: z.string(),
    phoneNumber: z.string(),
    gender: z.enum([USER.GENDER.MALE, USER.GENDER.FEMALE, USER.GENDER.OTHER]),
    birthDate: z.string(),
    avatar: z.string().nullable(),
    coin: z.number(),
    point: z.number(),
    status: z.enum([USER.USER_STATUS.ACTIVE, USER.USER_STATUS.INACTIVE]),
    roleId: z.number(),
    godProfileId: z.number().nullable(),
    createdById: z.number().nullable(),
    updatedById: z.number().nullable(),
    deletedById: z.number().nullable(),
    deletedAt: z.string().nullable(),
    createdAt: z.string(),
    updatedAt: z.string(),
    role: roleModel,
})

const meResponse = BackendResponseModel(meResponseData)
const mePaginationResponse = BackendPaginationResponseModel(meResponseData)

export type IMeResponse = z.infer<typeof meResponse>
export type IMePaginationResponse = z.infer<typeof mePaginationResponse>
//----------------------End----------------------//

// Point stats response
const pointStatsResponseData = z.object({
    averagePoint: z.number(),
    maxPoint: z.number(),
    totalUserLargePoint: z.number(),
})

const pointStatsResponse = BackendResponseModel(pointStatsResponseData)

export type IPointStatsResponseData = z.infer<typeof pointStatsResponseData>
export type IPointStatsResponse = z.infer<typeof pointStatsResponse>
//----------------------End----------------------//

// Point change log user data
const pointChangeLogUserData = z.object({
    id: z.number(),
    email: z.string(),
    name: z.string(),
    password: z.string(),
    phoneNumber: z.string(),
    avatar: z.string().nullable(),
    status: z.enum([USER.USER_STATUS.ACTIVE, USER.USER_STATUS.INACTIVE]),
    roleId: z.number(),
    createdById: z.number().nullable(),
    updatedById: z.number().nullable(),
    deletedById: z.number().nullable(),
    deletedAt: z.string().nullable(),
    createdAt: z.string(),
    updatedAt: z.string(),
    birthDate: z.string().nullable(),
    gender: z.enum([USER.GENDER.MALE, USER.GENDER.FEMALE, USER.GENDER.OTHER]).nullable(),
    coin: z.number(),
    point: z.number(),
    pointTestHome: z.boolean(),
    figureId: z.number().nullable(),
    godProfileId: z.number().nullable(),
    heart: z.number(),
});

// Point change log data
const pointChangeLogData = z.object({
    id: z.number(),
    userId: z.number(),
    reason: z.string(),
    newPoint: z.number(),
    snapshotPoint: z.number(),
    newCoin: z.number(),
    snapshotCoin: z.number(),
    newHeart: z.number(),
    snapshotHeart: z.number(),
    createdById: z.number(),
    deletedById: z.number().nullable(),
    updatedById: z.number().nullable(),
    deletedAt: z.string().nullable(),
    createdAt: z.string(),
    updatedAt: z.string(),
    user: pointChangeLogUserData,
});

// Point change log pagination response
const pointChangeLogPaginationResponse = BackendPaginationResponseModel(pointChangeLogData);

export type IPointChangeLogData = z.infer<typeof pointChangeLogData>;
export type IPointChangeLogPaginationResponse = z.infer<typeof pointChangeLogPaginationResponse>;
//----------------------End----------------------//

// User play stats response
const userPlayStatsResponseData = z.object({
    totalUser: z.number(),
    totalPlays: z.number(),
    ratemonthPre: z.number(),
    ratePlayPre: z.number(),
})

const userPlayStatsResponse = BackendResponseModel(userPlayStatsResponseData)

export type IUserPlayStatsResponseData = z.infer<typeof userPlayStatsResponseData>
export type IUserPlayStatsResponse = z.infer<typeof userPlayStatsResponse>
//----------------------End----------------------//

// Top user stats response
const topUserStatsData = z.object({
    userId: z.number(),
    name: z.string(),
    totalAnswers: z.number(),
    correctRate: z.number(),
    currentPoints: z.number(),
})

const topUserStatsResponse = BackendResponseModel(z.array(topUserStatsData))

export type ITopUserStatsData = z.infer<typeof topUserStatsData>
export type ITopUserStatsResponse = z.infer<typeof topUserStatsResponse>
//----------------------End----------------------//

// Monthly user stats response
const monthlyUserStatsData = z.object({
    month: z.number(),
    monthName: z.string(),
    newUsers: z.number(),
    changePercent: z.number(),
    totalPlays: z.number(),
    passRate: z.number(),
})

const monthlyUserStatsResponse = BackendResponseModel(z.array(monthlyUserStatsData))

export type IMonthlyUserStatsData = z.infer<typeof monthlyUserStatsData>
export type IMonthlyUserStatsResponse = z.infer<typeof monthlyUserStatsResponse>
//----------------------End----------------------//

// Land stats response
const landStatsData = z.object({
    landId: z.number(),
    landName: z.string(),
    totalAnswers: z.number(),
    averagePoints: z.number(),
    completionRate: z.number(),
})

const landStatsResponse = BackendResponseModel(z.array(landStatsData))

export type ILandStatsData = z.infer<typeof landStatsData>
export type ILandStatsResponse = z.infer<typeof landStatsResponse>
//----------------------End----------------------//

// User rank response
const userRankData = z.object({
    id: z.number(),
    name: z.string(),
    email: z.string(),
    avatar: z.string().nullable(),
    point: z.number(),
});

const userRankPagination = z.object({
    current: z.number(),
    pageSize: z.number(),
    totalPage: z.number(),
    totalItem: z.number(),
});

const userRankResponseData = z.object({
    results: z.array(userRankData),
    pagination: userRankPagination,
});

const userRankResponse = BackendResponseModel(userRankResponseData);

export type IUserRankData = z.infer<typeof userRankData>;
export type IUserRankPagination = z.infer<typeof userRankPagination>;
export type IUserRankResponseData = z.infer<typeof userRankResponseData>;
export type IUserRankResponse = z.infer<typeof userRankResponse>;
//----------------------End----------------------//

// User demographics statistics response
const genderAmountData = z.object({
    amount: z.number(),
    percent: z.number(),
});

const gendersData = z.object({
    male: genderAmountData,
    female: genderAmountData,
    other: genderAmountData,
});

const ageAmountData = z.object({
    amount: z.number(),
    percent: z.number(),
});

const agesData = z.object({
    "0-17": ageAmountData,
    "18-24": ageAmountData,
    "25-34": ageAmountData,
    "35-50": ageAmountData,
    "50+": ageAmountData,
});

const userDemographicsStatsData = z.object({
    genders: gendersData,
    ages: agesData,
});

const userDemographicsStatsResponse = BackendResponseModel(userDemographicsStatsData);

export type IGenderAmountData = z.infer<typeof genderAmountData>;
export type IGendersData = z.infer<typeof gendersData>;
export type IAgeAmountData = z.infer<typeof ageAmountData>;
export type IAgesData = z.infer<typeof agesData>;
export type IUserDemographicsStatsData = z.infer<typeof userDemographicsStatsData>;
export type IUserDemographicsStatsResponse = z.infer<typeof userDemographicsStatsResponse>;
//----------------------End----------------------//
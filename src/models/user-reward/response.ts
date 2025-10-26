export interface IUserReward {
    id: number;
    userId: number;
    rewardId: number;
    status: "PENDING" | "COMPLETED" | "CANCELLED";
    exchangedAt: string | null;
    code: string;
    valuePaid: number;
    createdById: number;
    updatedById: number | null;
    deletedById: number | null;
    deletedAt: string | null;
    createdAt: string;
    updatedAt: string;
    reward: {
        id: number;
        name: string;
        description: string;
        requireValue: number;
        gift: string;
        code: string;
        type: "CODE" | "COIN" | "POINT";
        limit: number;
        startDate: string;
        endDate: string | null;
        isActive: boolean;
        imageUrl: string | null;
        createdById: number;
        updatedById: number | null;
        deletedById: number | null;
        deletedAt: string | null;
        createdAt: string;
        updatedAt: string;
    };
    user: {
        id: number;
        email: string;
        name: string;
        password: string;
        phoneNumber: string;
        avatar: string | null;
        status: "ACTIVE" | "INACTIVE";
        roleId: number;
        createdById: number | null;
        updatedById: number | null;
        deletedById: number | null;
        deletedAt: string | null;
        createdAt: string;
        updatedAt: string;
        birthDate: string;
        gender: "MALE" | "FEMALE";
        coin: number;
        point: number;
        pointTestHome: boolean;
        figureId: number;
        godProfileId: number;
        heart: number;
    };
}

export interface IUserRewardPaginationResponse {
    statusCode: number;
    message: string;
    data: {
        results: IUserReward[];
        pagination: {
            current: number;
            pageSize: number;
            totalPage: number;
            totalItem: number;
        };
    };
}

export interface IRewardCode {
    id: number;
    name: string;
    description: string;
    requireValue: number;
    gift: string;
    code: string;
    type: "CODE" | "COIN" | "POINT";
    limit: number;
    startDate: string;
    endDate: string | null;
    isActive: boolean;
    imageUrl: string | null;
    createdById: number;
    updatedById: number | null;
    deletedById: number | null;
    deletedAt: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface IRewardCodeResponse {
    statusCode: number;
    data: IRewardCode[];
    message: string;
}

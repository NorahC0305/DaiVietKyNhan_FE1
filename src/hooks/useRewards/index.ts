"use client";

import { useState, useEffect, useCallback } from "react";
import rewardService from "@services/reward";
import userService from "@services/user";
import {
  IReward,
  IExchangeRewardRequest,
  IUserRewardExchange,
} from "@models/reward";
import { IMeResponse } from "@models/user/response";
import { toast } from "react-toastify";
import { useQuery, queryOptions } from "@tanstack/react-query";
import userRewardService from "@services/user-reward";
import { ISpecialGiftResponseModel } from "@models/user-reward/response";

export const useRewards = (isOpen: boolean) => {
  const [rewards, setRewards] = useState<IReward[]>([]);
  const [userRewardExchanges, setUserRewardExchanges] = useState<
    IUserRewardExchange[]
  >([]);
  const [userData, setUserData] = useState<IMeResponse["data"] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isExchanging, setIsExchanging] = useState<string | null>(null);
  const fetchUserData = useCallback(async () => {
    try {
      const response: any = await userService.getMe();
      if (response && response.statusCode === 200 && response.data) {
        setUserData(response.data);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  }, []);

  const fetchUserRewardExchanges = useCallback(async () => {
    try {
      setIsLoading(true);
      const userRewardsResponse: any = await rewardService.getUserRewards({
        currentPage: 1,
        pageSize: 1000,
        sort: "sort:-id",
      });
      if (
        userRewardsResponse &&
        userRewardsResponse.statusCode === 200 &&
        userRewardsResponse.data
      ) {
        setRewards(
          userRewardsResponse.data.map(
            (item: IUserRewardExchange) => item.reward
          )
        );
        setUserRewardExchanges(userRewardsResponse.data);
      }
    } catch (error) {
      console.error("Error fetching user reward exchanges:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleExchange = useCallback(
    async (rewardId: number, onRedeem?: (tierId: string) => void) => {
      try {
        setIsExchanging(rewardId.toString());
        const exchangeRequest: IExchangeRewardRequest = { rewardId };

        const response: any = await rewardService.exchangeReward(
          exchangeRequest
        );

        if (response && response.statusCode === 200) {
          toast.success("Đổi quà thành công!");
          await fetchUserData();
          await fetchUserRewardExchanges();
          onRedeem?.(rewardId.toString());
        } else {
          toast.error(response?.message || "Không thể đổi quà tặng");
        }
      } catch (error) {
        console.error("Error exchanging reward:", error);
        toast.error("Có lỗi xảy ra khi đổi quà tặng");
      } finally {
        setIsExchanging(null);
      }
    },
    [fetchUserData, fetchUserRewardExchanges]
  );

  useEffect(() => {
    if (isOpen) {
      fetchUserRewardExchanges();
      fetchUserData();
    }
  }, [isOpen, fetchUserRewardExchanges, fetchUserData]);

  return {
    rewards,
    userRewardExchanges,
    userData,
    isLoading,
    isExchanging,
    handleExchange,
    fetchUserData,
    fetchUserRewardExchanges,
  };
};

export const specialGiftKeys = {
  all: ["special-gifts"] as const,
  list: (params?: { currentPage?: number; pageSize?: number }) =>
    [...specialGiftKeys.all, params] as const,
};

export const specialGiftOptions = (params?: {
  currentPage?: number;
  pageSize?: number;
}) =>
  queryOptions({
    queryKey: specialGiftKeys.list(params),
    queryFn: async () => {
      const response =
        (await userRewardService.getSpecialGifts(
          params
        )) as ISpecialGiftResponseModel;

      const items = response?.data?.results ?? [];
      const pagination = response?.data?.pagination;

      return {
        items,
        pagination,
      };
    },
    staleTime: 30 * 1000,
  });

export const useSpecialGifts = (params?: {
  currentPage?: number;
  pageSize?: number;
}) => {
  return useQuery(specialGiftOptions(params));
};
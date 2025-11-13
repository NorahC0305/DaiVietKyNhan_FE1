"use client";

import { useCallback, useEffect, useState } from "react";
import godProfileService from "@services/god-profile";
import { IGodProfile } from "@models/god-profile/entity";
import { useQuery } from "@tanstack/react-query";
import { godProfileKeys } from "@hooks/useGodProfile";

export type UseGodProfilePointHomeResult = {
  loading: boolean;
  error: string | null;
  data: IGodProfile[] | null;
  refetch: () => Promise<void>;
};

export function useGodProfilePointHome(): UseGodProfilePointHomeResult {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<IGodProfile[] | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const resp = await godProfileService.getPointHome();
      const success =
        (resp as any)?.statusCode === 200 || (resp as any)?.statusCode === 201;
      const payload = (resp as any)?.data;
      if (success && payload) {
        // Normalize to array
        const list = Array.isArray(payload) ? payload : [payload];
        setData(list as IGodProfile[]);
      } else {
        const msg = (resp as any)?.message;
        setError(typeof msg === "string" ? msg : "Không lấy được kết quả.");
      }
    } catch (e) {
      setError("Không lấy được kết quả. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { loading, error, data, refetch: fetchData };
}

export function useGodProfileRanking() {
  return useQuery(godProfileKeys.ranking());
}
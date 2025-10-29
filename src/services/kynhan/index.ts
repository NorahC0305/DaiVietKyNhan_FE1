import http from "@configs/fetch";
import {
  IKyNhanSummaryResponseModel,
  IKyNhanResponseModel,
  IKyNhanUserListResponseModel,
  IKyNhanDetailResponseModel,
} from "@models/ky-nhan/response";
import { IUpdateKyNhanRequest } from "@models/ky-nhan/request";

const kynhanService = {
  getKyNhan: async (qs?: string, currentPage?: number, pageSize?: number) => {
    const parts: string[] = [];
    if (qs && qs.length > 0) {
      // qs is expected to be preformatted like: "sort:id,name:like=%XX%YY"
      parts.push(`qs=${qs}`);
    }
    if (currentPage !== undefined) {
      parts.push(`currentPage=${currentPage}`);
    }
    if (pageSize !== undefined) {
      parts.push(`pageSize=${pageSize}`);
    }
    const queryString = parts.length ? `?${parts.join("&")}` : "";
    const url = `/kynhan${queryString}`;

    return await http.get<IKyNhanResponseModel>(url, {
      cache: "no-store",
    });
  },
  getUserKyNhanList: async (searchQuery?: string) => {
    const qsParts: string[] = [];
    
    // Add default sorting
    qsParts.push("sort:-updatedAt");
    
    // Add search query if provided
    if (searchQuery) {
      qsParts.push(`name:like=${encodeURIComponent(searchQuery)}`);
    }
    
    const queryString = qsParts.join(",");
    return await http.get<IKyNhanUserListResponseModel>(`/kynhan/list/user?qs=${queryString}`, {
      cache: "no-store",
    });
  },
  createKyNhan: async (formData: FormData) => {
    return await http.post("/kynhan", formData);
  },
  updateKyNhan: async (kyNhanId: number, formData: FormData) => {
    return await http.put(`/kynhan/${kyNhanId}`, formData);
  },
  getKyNhanById: async (kyNhanId: number) => {
    return await http.get<IKyNhanDetailResponseModel>(`/kynhan/${kyNhanId}`, {
      cache: "no-store",
    });
  },
};

export default kynhanService;

import http from "@configs/fetch";
import { IMoTaKyNhanListResponseModel, IMoTaKyNhanDetailResponseModel } from "@models/mo-ta-ky-nhan/response";
import { IMoTaKyNhan } from "@models/mo-ta-ky-nhan/entity";

interface GetMoTaKyNhanListParams {
  currentPage?: number;
  pageSize?: number;
  sort?: string;
  search?: string;
}

const libcardService = {
  createLibCard: async (formData: FormData) => {
    // Chỉ nhận FormData và gửi trực tiếp
    return await http.post('/mo-ta-ky-nhan', formData);
  },

  getMoTaKyNhanList: async (params: GetMoTaKyNhanListParams = {}) => {
    const parts: string[] = [];
    if (params.sort) {
      // Keep qs as-is (already preformatted like: "sort:id,ten:like=%XX")
      parts.push(`qs=${params.sort}`);
    }
    if (params.currentPage !== undefined) {
      parts.push(`currentPage=${params.currentPage}`);
    }
    if (params.pageSize !== undefined) {
      parts.push(`pageSize=${params.pageSize}`);
    }
    if (params.search) {
      // If backend supports separate search param; this will be encoded normally
      parts.push(`search=${encodeURIComponent(params.search)}`);
    }
    const queryString = parts.length ? `?${parts.join('&')}` : '';
    const url = `/mo-ta-ky-nhan${queryString}`;

    return await http.get<IMoTaKyNhanListResponseModel>(url);
  },

  getMoTaKyNhanById: async (id: number) => {
    return await http.get<IMoTaKyNhanDetailResponseModel>(`/mo-ta-ky-nhan/${id}`);
  },

  getMoTaKyNhanByKyNhanId: async (kyNhanId: number) => {
    return await http.get(`/mo-ta-ky-nhan/kynhan/${kyNhanId}`);
  },

  updateMoTaKyNhan: async (id: number, formData: FormData) => {
    return await http.put(`/mo-ta-ky-nhan/${id}`, formData);
  },

  deleteMoTaKyNhan: async (id: number) => {
    return await http.delete(`/mo-ta-ky-nhan/${id}`, {});
  },
};

export default libcardService;

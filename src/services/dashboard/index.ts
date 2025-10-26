import http from "@configs/fetch";

const dashboardService = {
  getDashboardStats: async () => {
    return await http.get("/dashboard/stats", {
      cache: 'no-store',
    });
  },
};

export default dashboardService;
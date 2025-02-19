import api from "./api";

export const activityService = {
  getRecentActivities: async (params = {}) => {
    const { limit = 10, type, startDate, endDate } = params;
    const queryParams = new URLSearchParams();

    if (limit) queryParams.append("limit", limit);
    if (type) queryParams.append("type", type);
    if (startDate) queryParams.append("startDate", startDate);
    if (endDate) queryParams.append("endDate", endDate);

    return api.get(`/activity/recent?${queryParams.toString()}`);
  },

  getActivityStats: async (params = {}) => {
    const { startDate, endDate } = params;
    const queryParams = new URLSearchParams();

    if (startDate) queryParams.append("startDate", startDate);
    if (endDate) queryParams.append("endDate", endDate);

    return api.get(`/activity/stats?${queryParams.toString()}`);
  },
};

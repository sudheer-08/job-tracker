import { useQuery } from "@tanstack/react-query";
import * as dashboardApi from "../api/dashboard.api";
import { dashboardKeys } from "./queryKeys";

export const useDashboardOverview = () =>
  useQuery({
    queryKey: dashboardKeys.overview(),
    queryFn: async () => {
      const { data } = await dashboardApi.getDashboardOverview();
      return data;
    },
  });

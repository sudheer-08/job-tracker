import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as applicationsApi from "../api/applications.api";
import { applicationKeys } from "./queryKeys";

export const useApplications = (params) =>
  useQuery({
    queryKey: applicationKeys.list(params),
    queryFn: async () => {
      const { data } = await applicationsApi.getApplications(params);
      return data;
    },
    placeholderData: (prev) => prev,
  });

export const useApplication = (id) =>
  useQuery({
    queryKey: applicationKeys.detail(id),
    queryFn: async () => {
      const { data } = await applicationsApi.getApplication(id);
      return data.application;
    },
    enabled: Boolean(id),
  });

export const useCreateApplication = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload) => applicationsApi.createApplication(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: applicationKeys.lists() });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
};

export const useUpdateApplication = (id) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload) => applicationsApi.updateApplication(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: applicationKeys.lists() });
      queryClient.invalidateQueries({ queryKey: applicationKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
};

export const useDeleteApplication = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => applicationsApi.deleteApplication(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: applicationKeys.lists() });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
};

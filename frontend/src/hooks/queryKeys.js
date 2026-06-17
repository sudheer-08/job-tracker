export const applicationKeys = {
  all: ["applications"],
  lists: () => [...applicationKeys.all, "list"],
  list: (params) => [...applicationKeys.lists(), params],
  details: () => [...applicationKeys.all, "detail"],
  detail: (id) => [...applicationKeys.details(), id],
};

export const dashboardKeys = {
  all: ["dashboard"],
  overview: () => [...dashboardKeys.all, "overview"],
};

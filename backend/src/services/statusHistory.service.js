import prisma from "../config/prisma.js";
import { activeApplicationFilter } from "../utils/applicationFilters.js";

export const getStatusHistory = async (userId, applicationId) => {
  const application = await prisma.application.findFirst({
    where: { id: applicationId, userId, ...activeApplicationFilter },
  });
  if (!application) throw new Error("Application not found");

  return prisma.statusHistory.findMany({
    where: { applicationId },
    select: {
      fromStatus: true,
      toStatus: true,
      changedAt: true,
    },
    orderBy: { changedAt: "asc" },
  });
};

export const recordStatusChange = async (tx, applicationId, fromStatus, toStatus, note = null) => {
  return tx.statusHistory.create({
    data: {
      applicationId,
      fromStatus,
      toStatus,
      note,
    },
  });
};

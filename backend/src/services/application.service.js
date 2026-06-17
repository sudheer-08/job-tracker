import prisma from "../config/prisma.js";
import { recordStatusChange } from "./statusHistory.service.js";
import { activeApplicationFilter } from "../utils/applicationFilters.js";

const MAX_PAGE_LIMIT = 100;

export const SORTABLE_FIELDS = [
  "createdAt",
  "updatedAt",
  "companyName",
  "jobTitle",
  "status",
  "appliedDate",
  "followUpDate",
  "deletedAt",
];

export const createApplication = async (userId, data) => {
  return prisma.application.create({
    data: {
      ...data,
      userId,
    },
  });
};

export const getApplications = async (userId, query) => {
  const page = Math.max(1, Number(query.page) || 1);
  const limit = Math.min(MAX_PAGE_LIMIT, Math.max(1, Number(query.limit) || 10));
  const skip = (page - 1) * limit;

  const { search, status, source, sort = "createdAt", order = "desc" } = query;

  const where = {
    userId,
    ...activeApplicationFilter,
    ...(status && { status }),
    ...(source && {
      source: { equals: source, mode: "insensitive" },
    }),
    ...(search?.trim() && {
      OR: [
        { companyName: { contains: search.trim(), mode: "insensitive" } },
        { jobTitle: { contains: search.trim(), mode: "insensitive" } },
      ],
    }),
  };

  const [applications, total] = await Promise.all([
    prisma.application.findMany({
      where,
      skip,
      take: limit,
      orderBy: { [sort]: order },
    }),
    prisma.application.count({ where }),
  ]);

  return {
    applications,
    total,
    page,
    pages: total === 0 ? 0 : Math.ceil(total / limit),
  };
};

export const getTrashedApplications = async (userId, query) => {
  const page = Math.max(1, Number(query.page) || 1);
  const limit = Math.min(MAX_PAGE_LIMIT, Math.max(1, Number(query.limit) || 10));
  const skip = (page - 1) * limit;

  const where = {
    userId,
    deletedAt: { not: null },
  };

  const [applications, total] = await Promise.all([
    prisma.application.findMany({
      where,
      skip,
      take: limit,
      orderBy: { deletedAt: "desc" },
    }),
    prisma.application.count({ where }),
  ]);

  return {
    applications,
    total,
    page,
    pages: total === 0 ? 0 : Math.ceil(total / limit),
  };
};

export const getApplicationById = async (userId, applicationId) => {
  const application = await prisma.application.findFirst({
    where: { id: applicationId, userId, ...activeApplicationFilter },
  });
  if (!application) throw new Error("Application not found");
  return application;
};

export const updateApplication = async (userId, applicationId, data) => {
  const application = await prisma.application.findFirst({
    where: { id: applicationId, userId, ...activeApplicationFilter },
  });
  if (!application) throw new Error("Application not found");

  const { note, statusNote, ...applicationData } = data;
  const historyNote = note ?? statusNote ?? null;

  if (
    applicationData.status !== undefined &&
    applicationData.status !== application.status
  ) {
    return prisma.$transaction(async (tx) => {
      const updated = await tx.application.update({
        where: { id: applicationId },
        data: applicationData,
      });

      await recordStatusChange(
        tx,
        applicationId,
        application.status,
        applicationData.status,
        historyNote
      );

      return updated;
    });
  }

  return prisma.application.update({
    where: { id: applicationId },
    data: applicationData,
  });
};

export const deleteApplication = async (userId, applicationId) => {
  const application = await prisma.application.findFirst({
    where: { id: applicationId, userId, ...activeApplicationFilter },
  });
  if (!application) throw new Error("Application not found");

  return prisma.application.update({
    where: { id: applicationId },
    data: { deletedAt: new Date() },
  });
};

export const restoreApplication = async (userId, applicationId) => {
  const application = await prisma.application.findFirst({
    where: { id: applicationId, userId, deletedAt: { not: null } },
  });
  if (!application) throw new Error("Application not found in trash");

  return prisma.application.update({
    where: { id: applicationId },
    data: { deletedAt: null },
  });
};

import prisma from "../config/prisma.js";
import { activeApplicationFilter } from "../utils/applicationFilters.js";

const applicationSelect = {
  id: true,
  companyName: true,
  jobTitle: true,
  status: true,
  followUpDate: true,
  appliedDate: true,
  jobUrl: true,
};

const startOfDay = (date = new Date()) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
};

const endOfDay = (date = new Date()) => {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d;
};

const addDays = (date, days) => {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
};

const getDateRanges = () => {
  const today = new Date();
  const todayStart = startOfDay(today);
  const todayEnd = endOfDay(today);
  const upcomingEnd = endOfDay(addDays(today, 7));

  return { todayStart, todayEnd, upcomingEnd };
};

const baseWhere = (userId) => ({
  userId,
  ...activeApplicationFilter,
  followUpDate: { not: null },
});

export const getOverdueReminders = async (userId) => {
  const { todayStart } = getDateRanges();

  return prisma.application.findMany({
    where: {
      ...baseWhere(userId),
      followUpDate: { lt: todayStart },
    },
    select: applicationSelect,
    orderBy: { followUpDate: "asc" },
  });
};

export const getDueTodayReminders = async (userId) => {
  const { todayStart, todayEnd } = getDateRanges();

  return prisma.application.findMany({
    where: {
      ...baseWhere(userId),
      followUpDate: { gte: todayStart, lte: todayEnd },
    },
    select: applicationSelect,
    orderBy: { followUpDate: "asc" },
  });
};

export const getUpcomingReminders = async (userId) => {
  const { todayEnd, upcomingEnd } = getDateRanges();

  return prisma.application.findMany({
    where: {
      ...baseWhere(userId),
      followUpDate: { gt: todayEnd, lte: upcomingEnd },
    },
    select: applicationSelect,
    orderBy: { followUpDate: "asc" },
  });
};

export const getAllReminders = async (userId) => {
  const [overdue, dueToday, upcoming] = await Promise.all([
    getOverdueReminders(userId),
    getDueTodayReminders(userId),
    getUpcomingReminders(userId),
  ]);

  return { overdue, dueToday, upcoming };
};

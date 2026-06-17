import prisma from "../config/prisma.js";
import { getAllReminders } from "./reminder.service.js";

const PIPELINE_STAGES = ["APPLIED", "SCREENING", "INTERVIEW", "OFFER"];

const buildStats = (statusCounts) => {
  const stats = {
    totalApplications: 0,
    activeApplications: 0,
    interviews: 0,
    offers: 0,
    rejected: 0,
    withdrawn: 0,
  };

  const statusDistribution = [];

  statusCounts.forEach((item) => {
    const count = item._count._all;
    stats.totalApplications += count;
    statusDistribution.push({ status: item.status, count });

    const status = item.status.toLowerCase();

    if (status.includes("interview")) {
      stats.interviews += count;
    } else if (status.includes("offer")) {
      stats.offers += count;
    } else if (status.includes("reject")) {
      stats.rejected += count;
    } else if (status.includes("withdraw")) {
      stats.withdrawn += count;
    } else {
      stats.activeApplications += count;
    }
  });

  return { stats, statusDistribution };
};

const buildApplicationsByMonth = (applications) => {
  const monthCounts = new Map();

  for (let i = 5; i >= 0; i -= 1) {
    const date = new Date();
    date.setDate(1);
    date.setMonth(date.getMonth() - i);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    monthCounts.set(key, 0);
  }

  applications.forEach((app) => {
    const date = new Date(app.createdAt);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    if (monthCounts.has(key)) {
      monthCounts.set(key, monthCounts.get(key) + 1);
    }
  });

  return Array.from(monthCounts.entries()).map(([month, count]) => {
    const [year, monthNum] = month.split("-");
    const label = new Date(Number(year), Number(monthNum) - 1).toLocaleString("en-US", {
      month: "short",
    });
    return { month, label, count };
  });
};

const buildPipelineFunnel = (statusCounts) => {
  const countMap = Object.fromEntries(
    statusCounts.map((item) => [item.status, item._count._all])
  );

  return PIPELINE_STAGES.map((stage) => ({
    stage,
    count: countMap[stage] || 0,
  }));
};

export const getDashboardStats = async (userId) => {
  const statusCounts = await prisma.application.groupBy({
    by: ["status"],
    where: { userId, deletedAt: null },
    _count: { _all: true },
  });

  return buildStats(statusCounts).stats;
};

export const getDashboardOverview = async (userId) => {
  const where = { userId, deletedAt: null };

  const [statusCounts, applications, recentActivity, reminders] = await Promise.all([
    prisma.application.groupBy({
      by: ["status"],
      where,
      _count: { _all: true },
    }),
    prisma.application.findMany({
      where,
      select: { createdAt: true },
    }),
    prisma.application.findMany({
      where,
      select: {
        id: true,
        companyName: true,
        jobTitle: true,
        status: true,
        updatedAt: true,
      },
      orderBy: { updatedAt: "desc" },
      take: 5,
    }),
    getAllReminders(userId),
  ]);

  const { stats, statusDistribution } = buildStats(statusCounts);

  return {
    stats: {
      ...stats,
      followUpsDue: reminders.overdue.length + reminders.dueToday.length,
    },
    statusDistribution,
    applicationsByMonth: buildApplicationsByMonth(applications),
    pipelineFunnel: buildPipelineFunnel(statusCounts),
    followUps: {
      dueToday: reminders.dueToday,
      overdue: reminders.overdue,
      upcoming: reminders.upcoming,
    },
    recentActivity,
  };
};

import * as dashboardService from "../services/dashboard.service.js";

export const getStats = async (req, res) => {
  try {
    const userId = req.user.id ?? req.user.userId;
    const stats = await dashboardService.getDashboardStats(userId);
    res.status(200).json(stats);
  } catch (error) {
    console.error("Get Dashboard Stats Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getOverview = async (req, res) => {
  try {
    const userId = req.user.id ?? req.user.userId;
    const overview = await dashboardService.getDashboardOverview(userId);
    res.status(200).json(overview);
  } catch (error) {
    console.error("Get Dashboard Overview Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

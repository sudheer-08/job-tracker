import * as statusHistoryService from "../services/statusHistory.service.js";

export const getStatusHistory = async (req, res) => {
  try {
    const userId = req.user.userId;
    const applicationId = req.params.id;
    const history = await statusHistoryService.getStatusHistory(userId, applicationId);
    res.status(200).json(history);
  } catch (error) {
    if (error.message === "Application not found") {
      return res.status(404).json({ error: error.message });
    }
    console.error("Get Status History Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

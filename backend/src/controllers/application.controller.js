import * as applicationService from "../services/application.service.js";

const VALID_STATUSES = ["APPLIED", "SCREENING", "INTERVIEW", "OFFER", "REJECTED", "WITHDRAWN"];

export const createApplication = async (req, res) => {
  try {
    const userId = req.user.id;
    const { companyName, jobTitle, status, appliedDate, jobUrl, source, followUpDate } = req.body;

    if (!companyName || !jobTitle) {
      return res.status(400).json({ error: "Company name and job title are required" });
    }

    const application = await applicationService.createApplication(userId, {
      companyName,
      jobTitle,
      status: status || "APPLIED",
      appliedDate: appliedDate ? new Date(appliedDate) : null,
      jobUrl,
      source,
      followUpDate: followUpDate ? new Date(followUpDate) : null,
    });

    res.status(201).json({ application });
  } catch (error) {
    console.error("Create Application Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getApplications = async (req, res) => {
  try {
    const userId = req.user.id;
    const { sort, order, status } = req.query;

    if (sort && !applicationService.SORTABLE_FIELDS.includes(sort)) {
      return res.status(400).json({
        error: `Invalid sort field. Allowed: ${applicationService.SORTABLE_FIELDS.join(", ")}`,
      });
    }

    if (order && !["asc", "desc"].includes(order.toLowerCase())) {
      return res.status(400).json({ error: "Invalid order. Use asc or desc" });
    }

    if (status && !VALID_STATUSES.includes(status)) {
      return res.status(400).json({
        error: `Invalid status. Allowed: ${VALID_STATUSES.join(", ")}`,
      });
    }

    const result = await applicationService.getApplications(userId, {
      ...req.query,
      order: order?.toLowerCase() ?? "desc",
    });

    res.status(200).json(result);
  } catch (error) {
    console.error("Get Applications Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getApplicationById = async (req, res) => {
  try {
    const userId = req.user.id;
    const applicationId = req.params.id;
    const application = await applicationService.getApplicationById(userId, applicationId);
    res.status(200).json({ application });
  } catch (error) {
    if (error.message === "Application not found") {
      return res.status(404).json({ error: error.message });
    }
    console.error("Get Application By Id Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateApplication = async (req, res) => {
  try {
    const userId = req.user.id;
    const applicationId = req.params.id;
    const data = { ...req.body };
    
    if (data.appliedDate) data.appliedDate = new Date(data.appliedDate);
    if (data.followUpDate) data.followUpDate = new Date(data.followUpDate);

    const application = await applicationService.updateApplication(userId, applicationId, data);
    res.status(200).json({ application });
  } catch (error) {
    if (error.message === "Application not found") {
      return res.status(404).json({ error: error.message });
    }
    console.error("Update Application Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getTrashedApplications = async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await applicationService.getTrashedApplications(userId, req.query);
    res.status(200).json(result);
  } catch (error) {
    console.error("Get Trashed Applications Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const restoreApplication = async (req, res) => {
  try {
    const userId = req.user.id;
    const applicationId = req.params.id;
    const application = await applicationService.restoreApplication(userId, applicationId);
    res.status(200).json({ application, message: "Application restored successfully" });
  } catch (error) {
    if (error.message === "Application not found in trash") {
      return res.status(404).json({ error: error.message });
    }
    console.error("Restore Application Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteApplication = async (req, res) => {
  try {
    const userId = req.user.id;
    const applicationId = req.params.id;
    await applicationService.deleteApplication(userId, applicationId);
    res.status(200).json({ message: "Application deleted successfully" });
  } catch (error) {
    if (error.message === "Application not found") {
      return res.status(404).json({ error: error.message });
    }
    console.error("Delete Application Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

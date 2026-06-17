import { Router } from "express";
import * as applicationController from "../controllers/application.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = Router();

// Apply authentication middleware to all routes
router.use(authenticate);

router.post("/", applicationController.createApplication);
router.get("/trash", applicationController.getTrashedApplications);
router.get("/", applicationController.getApplications);
router.post("/:id/restore", applicationController.restoreApplication);
router.get("/:id", applicationController.getApplicationById);
router.put("/:id", applicationController.updateApplication);
router.delete("/:id", applicationController.deleteApplication);

export default router;

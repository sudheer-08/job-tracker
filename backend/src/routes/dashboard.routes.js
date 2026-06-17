import { Router } from "express";
import * as dashboardController from "../controllers/dashboard.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = Router();

router.use(authenticate);

router.get("/stats", dashboardController.getStats);
router.get("/overview", dashboardController.getOverview);

export default router;

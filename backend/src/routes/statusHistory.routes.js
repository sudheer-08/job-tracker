import { Router } from "express";
import * as statusHistoryController from "../controllers/statusHistory.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = Router();

router.use(authenticate);
router.get("/:id/history", statusHistoryController.getStatusHistory);

export default router;

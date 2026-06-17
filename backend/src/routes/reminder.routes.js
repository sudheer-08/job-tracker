import { Router } from "express";
import * as reminderController from "../controllers/reminder.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = Router();

router.use(authenticate);

router.get("/due-today", reminderController.getDueTodayReminders);
router.get("/upcoming", reminderController.getUpcomingReminders);
router.get("/overdue", reminderController.getOverdueReminders);
router.get("/", reminderController.getAllReminders);

export default router;

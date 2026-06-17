import { Router } from "express";
import * as noteController from "../controllers/note.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = Router();

router.use(authenticate);

router.post("/", noteController.createNote);
router.get("/:applicationId", noteController.getNotesByApplication);
router.put("/:id", noteController.updateNote);
router.delete("/:id", noteController.deleteNote);

export default router;

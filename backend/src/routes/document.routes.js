import { Router } from "express";
import * as documentController from "../controllers/document.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { uploadDocument, handleUploadError } from "../middleware/upload.middleware.js";

const router = Router();

router.use(authenticate);

router.post(
  "/upload",
  (req, res, next) => {
    uploadDocument.single("file")(req, res, (err) => {
      if (err) return handleUploadError(err, req, res, next);
      next();
    });
  },
  documentController.uploadDocument
);

router.get("/:applicationId", documentController.getDocumentsByApplication);
router.delete("/:id", documentController.deleteDocument);

export default router;

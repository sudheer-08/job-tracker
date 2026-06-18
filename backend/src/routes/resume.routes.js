import express from 'express';
import multer from 'multer';
import { analyzeResumeController } from '../controllers/resume.controller.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/analyze', upload.single('resume'), analyzeResumeController);

export default router;
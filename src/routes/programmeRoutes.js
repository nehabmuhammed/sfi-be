import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import * as programmeController from '../controllers/programmeController.js';

const router = express.Router();

router.get('/', programmeController.getProgrammes);
router.get('/:id', programmeController.getProgrammeById);
router.post('/', protect, programmeController.createProgramme);
router.put('/:id', protect, programmeController.updateProgramme);
router.delete('/:id', protect, programmeController.deleteProgramme);

export default router;
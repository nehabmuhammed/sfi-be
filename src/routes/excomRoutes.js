import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import * as excomController from '../controllers/excomController.js';

const router = express.Router();

router.get('/', excomController.getExcom);
router.get('/:id', excomController.getExcomById);
router.post('/', protect, excomController.createExcom);
router.put('/:id', protect, excomController.updateExcom);
router.delete('/:id', protect, excomController.deleteExcom);

export default router;
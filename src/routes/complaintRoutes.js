import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import * as complaintController from '../controllers/complaintController.js';

const router = express.Router();

router.post('/', complaintController.createComplaint);
router.get('/', protect, complaintController.getComplaints);
router.get('/:id', protect, complaintController.getComplaintById);
router.put('/:id', protect, complaintController.updateComplaint);
router.delete('/:id', protect, complaintController.deleteComplaint);

export default router;
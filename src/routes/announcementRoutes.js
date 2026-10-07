import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import * as announcementController from '../controllers/announcementController.js';

const router = express.Router();

router.get('/', announcementController.getAnnouncements);
router.get('/:id', announcementController.getAnnouncementById);
router.post('/', protect, announcementController.createAnnouncement);
router.put('/:id', protect, announcementController.updateAnnouncement);
router.delete('/:id', protect, announcementController.deleteAnnouncement);

export default router;
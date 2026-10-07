import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import * as galleryController from '../controllers/galleryController.js';

const router = express.Router();

router.get('/', galleryController.getGallery);
router.get('/:id', galleryController.getGalleryById);
router.post('/', protect, galleryController.createGallery);
router.put('/:id', protect, galleryController.updateGallery);
router.delete('/:id', protect, galleryController.deleteGallery);

export default router;
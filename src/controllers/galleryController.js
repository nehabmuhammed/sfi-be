import Gallery from '../models/Gallery.js';
export const getGallery = async (req, res, next) => {
  try {
    const data = await Gallery.find({ isActive: true }).sort({ order: 1 });
    res.json({ success: true, data });
  } catch (error) { next(error); }
};
export const getGalleryById = async (req, res, next) => {
  try {
    const data = await Gallery.findById(req.params.id);
    if (!data) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, data });
  } catch (error) { next(error); }
};
export const createGallery = async (req, res, next) => {
  try {
    const data = await Gallery.create(req.body);
    res.status(201).json({ success: true, message: 'Created successfully', data });
  } catch (error) { next(error); }
};
export const updateGallery = async (req, res, next) => {
  try {
    const data = await Gallery.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!data) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, message: 'Updated successfully', data });
  } catch (error) { next(error); }
};
export const deleteGallery = async (req, res, next) => {
  try {
    const data = await Gallery.findByIdAndDelete(req.params.id);
    if (!data) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, message: 'Deleted successfully' });
  } catch (error) { next(error); }
};
import Announcement from '../models/Announcement.js';
export const getAnnouncements = async (req, res, next) => {
  try {
    const data = await Announcement.find({ isActive: true }).sort({ createdAt: -1 });
    res.json({ success: true, data });
  } catch (error) { next(error); }
};
export const getAnnouncementById = async (req, res, next) => {
  try {
    const data = await Announcement.findById(req.params.id);
    if (!data) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, data });
  } catch (error) { next(error); }
};
export const createAnnouncement = async (req, res, next) => {
  try {
    const data = await Announcement.create(req.body);
    res.status(201).json({ success: true, message: 'Created successfully', data });
  } catch (error) { next(error); }
};
export const updateAnnouncement = async (req, res, next) => {
  try {
    const data = await Announcement.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!data) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, message: 'Updated successfully', data });
  } catch (error) { next(error); }
};
export const deleteAnnouncement = async (req, res, next) => {
  try {
    const data = await Announcement.findByIdAndDelete(req.params.id);
    if (!data) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, message: 'Deleted successfully' });
  } catch (error) { next(error); }
};
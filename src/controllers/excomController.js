import Excom from '../models/Excom.js';
export const getExcom = async (req, res, next) => {
  try {
    const data = await Excom.find({ isActive: true }).sort({ order: 1 });
    res.json({ success: true, data });
  } catch (error) { next(error); }
};
export const getExcomById = async (req, res, next) => {
  try {
    const data = await Excom.findById(req.params.id);
    if (!data) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, data });
  } catch (error) { next(error); }
};
export const createExcom = async (req, res, next) => {
  try {
    const data = await Excom.create(req.body);
    res.status(201).json({ success: true, message: 'Created successfully', data });
  } catch (error) { next(error); }
};
export const updateExcom = async (req, res, next) => {
  try {
    const data = await Excom.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!data) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, message: 'Updated successfully', data });
  } catch (error) { next(error); }
};
export const deleteExcom = async (req, res, next) => {
  try {
    const data = await Excom.findByIdAndDelete(req.params.id);
    if (!data) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, message: 'Deleted successfully' });
  } catch (error) { next(error); }
};
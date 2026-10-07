import Programme from '../models/Programme.js';
export const getProgrammes = async (req, res, next) => {
  try {
    const data = await Programme.find().sort({ createdAt: -1 });
    res.json({ success: true, data });
  } catch (error) { next(error); }
};
export const getProgrammeById = async (req, res, next) => {
  try {
    const data = await Programme.findById(req.params.id);
    if (!data) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, data });
  } catch (error) { next(error); }
};
export const createProgramme = async (req, res, next) => {
  try {
    const data = await Programme.create(req.body);
    res.status(201).json({ success: true, message: 'Created successfully', data });
  } catch (error) { next(error); }
};
export const updateProgramme = async (req, res, next) => {
  try {
    const data = await Programme.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!data) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, message: 'Updated successfully', data });
  } catch (error) { next(error); }
};
export const deleteProgramme = async (req, res, next) => {
  try {
    const data = await Programme.findByIdAndDelete(req.params.id);
    if (!data) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, message: 'Deleted successfully' });
  } catch (error) { next(error); }
};
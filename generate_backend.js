import fs from 'fs';
import path from 'path';

const models = {
  Announcement: `import mongoose from 'mongoose';
const schema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });
export default mongoose.model('Announcement', schema);`,

  Complaint: `import mongoose from 'mongoose';
const schema = new mongoose.Schema({
  category: { type: String, required: true },
  department: { type: String },
  complaint: { type: String, required: true },
  name: { type: String },
  whatsapp: { type: String },
  anonymous: { type: Boolean, default: false },
  status: { type: String, default: 'New', enum: ['New', 'Under Review', 'Inspection', 'Verified', 'Not Verified', 'Action Taken', 'Resolved'] }
}, { timestamps: true });
export default mongoose.model('Complaint', schema);`,

  Excom: `import mongoose from 'mongoose';
const schema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, required: true },
  image: { type: String },
  order: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });
export default mongoose.model('Excom', schema);`,

  Programme: `import mongoose from 'mongoose';
const schema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: String },
  month: { type: String },
  venue: { type: String },
  time: { type: String },
  image: { type: String },
  isUpcoming: { type: Boolean, default: true }
}, { timestamps: true });
export default mongoose.model('Programme', schema);`,

  Gallery: `import mongoose from 'mongoose';
const schema = new mongoose.Schema({
  image: { type: String, required: true },
  caption: { type: String },
  order: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });
export default mongoose.model('Gallery', schema);`
};

const controllers = {
  announcement: `import Announcement from '../models/Announcement.js';
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
};`,

  complaint: `import Complaint from '../models/Complaint.js';
export const createComplaint = async (req, res, next) => {
  try {
    const data = await Complaint.create(req.body);
    res.status(201).json({ success: true, message: 'Created successfully', data });
  } catch (error) { next(error); }
};
export const getComplaints = async (req, res, next) => {
  try {
    const data = await Complaint.find().sort({ createdAt: -1 });
    res.json({ success: true, data });
  } catch (error) { next(error); }
};
export const getComplaintById = async (req, res, next) => {
  try {
    const data = await Complaint.findById(req.params.id);
    if (!data) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, data });
  } catch (error) { next(error); }
};
export const updateComplaint = async (req, res, next) => {
  try {
    const data = await Complaint.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!data) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, message: 'Updated successfully', data });
  } catch (error) { next(error); }
};
export const deleteComplaint = async (req, res, next) => {
  try {
    const data = await Complaint.findByIdAndDelete(req.params.id);
    if (!data) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, message: 'Deleted successfully' });
  } catch (error) { next(error); }
};`,

  excom: `import Excom from '../models/Excom.js';
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
};`,

  programme: `import Programme from '../models/Programme.js';
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
};`,

  gallery: `import Gallery from '../models/Gallery.js';
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
};`
};

const makeRoutes = (name, controllerName, endpoints) => {
  const cap = name.charAt(0).toUpperCase() + name.slice(1);
  let content = `import express from 'express';\nimport * as ${controllerName} from '../controllers/${controllerName}.js';\n\nconst router = express.Router();\n\n`;
  for (const { method, path, handler } of endpoints) {
    content += `router.${method}('${path}', ${controllerName}.${handler});\n`;
  }
  content += `\nexport default router;`;
  return content;
};

const routes = {
  announcement: makeRoutes('announcement', 'announcementController', [
    { method: 'get', path: '/', handler: 'getAnnouncements' },
    { method: 'get', path: '/:id', handler: 'getAnnouncementById' },
    { method: 'post', path: '/', handler: 'createAnnouncement' },
    { method: 'put', path: '/:id', handler: 'updateAnnouncement' },
    { method: 'delete', path: '/:id', handler: 'deleteAnnouncement' }
  ]),
  complaint: makeRoutes('complaint', 'complaintController', [
    { method: 'post', path: '/', handler: 'createComplaint' },
    { method: 'get', path: '/', handler: 'getComplaints' },
    { method: 'get', path: '/:id', handler: 'getComplaintById' },
    { method: 'put', path: '/:id', handler: 'updateComplaint' },
    { method: 'delete', path: '/:id', handler: 'deleteComplaint' }
  ]),
  excom: makeRoutes('excom', 'excomController', [
    { method: 'get', path: '/', handler: 'getExcom' },
    { method: 'get', path: '/:id', handler: 'getExcomById' },
    { method: 'post', path: '/', handler: 'createExcom' },
    { method: 'put', path: '/:id', handler: 'updateExcom' },
    { method: 'delete', path: '/:id', handler: 'deleteExcom' }
  ]),
  programme: makeRoutes('programme', 'programmeController', [
    { method: 'get', path: '/', handler: 'getProgrammes' },
    { method: 'get', path: '/:id', handler: 'getProgrammeById' },
    { method: 'post', path: '/', handler: 'createProgramme' },
    { method: 'put', path: '/:id', handler: 'updateProgramme' },
    { method: 'delete', path: '/:id', handler: 'deleteProgramme' }
  ]),
  gallery: makeRoutes('gallery', 'galleryController', [
    { method: 'get', path: '/', handler: 'getGallery' },
    { method: 'get', path: '/:id', handler: 'getGalleryById' },
    { method: 'post', path: '/', handler: 'createGallery' },
    { method: 'put', path: '/:id', handler: 'updateGallery' },
    { method: 'delete', path: '/:id', handler: 'deleteGallery' }
  ])
};

const writeFiles = (dir, obj) => {
  Object.entries(obj).forEach(([name, content]) => {
    const ext = name.charAt(0).toUpperCase() === name.charAt(0) ? '.js' : (name.endsWith('Controller') || name.endsWith('Routes') ? '.js' : (dir.includes('routes') ? 'Routes.js' : 'Controller.js'));
    let filename = name;
    if (dir.includes('models')) filename = name + '.js';
    else if (dir.includes('controllers')) filename = name + 'Controller.js';
    else if (dir.includes('routes')) filename = name + 'Routes.js';
    fs.writeFileSync(path.join(dir, filename), content);
  });
};

writeFiles(path.join(process.cwd(), 'src/models'), models);
writeFiles(path.join(process.cwd(), 'src/controllers'), controllers);
writeFiles(path.join(process.cwd(), 'src/routes'), routes);

// Middleware
fs.writeFileSync(path.join(process.cwd(), 'src/middleware/errorMiddleware.js'), `export const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error'
  });
};`);

console.log('Backend files generated.');

import fs from 'fs';
import path from 'path';

const modelsPath = path.join(process.cwd(), 'src', 'models');
const middlewarePath = path.join(process.cwd(), 'src', 'middleware');
const controllersPath = path.join(process.cwd(), 'src', 'controllers');
const routesPath = path.join(process.cwd(), 'src', 'routes');
const scriptsPath = path.join(process.cwd(), 'src', 'scripts');

if (!fs.existsSync(scriptsPath)) fs.mkdirSync(scriptsPath, { recursive: true });

// 1. Admin.js
fs.writeFileSync(path.join(modelsPath, 'Admin.js'), `import mongoose from 'mongoose';
const schema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  name: { type: String, required: true },
  role: { type: String, default: 'admin', enum: ['admin', 'superadmin'] },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });
export default mongoose.model('Admin', schema);`);

// 2. authMiddleware.js
fs.writeFileSync(path.join(middlewarePath, 'authMiddleware.js'), `import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';

export const protect = async (req, res, next) => {
  try {
    let token = req.cookies.jwt;
    if (!token) {
      return res.status(401).json({ success: false, message: 'Not authorized, no token' });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    req.admin = await Admin.findById(decoded.id).select('-passwordHash');
    if (!req.admin || !req.admin.isActive) {
      return res.status(401).json({ success: false, message: 'Not authorized, admin inactive or not found' });
    }
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: 'Not authorized, token failed' });
  }
};`);

// 3. roleMiddleware.js
fs.writeFileSync(path.join(middlewarePath, 'roleMiddleware.js'), `export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.admin.role)) {
      return res.status(403).json({ success: false, message: 'User role not authorized' });
    }
    next();
  };
};`);

// 4. authController.js
fs.writeFileSync(path.join(controllersPath, 'authController.js'), `import Admin from '../models/Admin.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'secret', {
    expiresIn: process.env.JWT_EXPIRES_IN || '1h',
  });
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });
    if (admin && admin.isActive && (await bcrypt.compare(password, admin.passwordHash))) {
      const token = generateToken(admin._id);
      res.cookie('jwt', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 1000 // 1 hour
      });
      res.json({
        success: true,
        data: { _id: admin._id, name: admin.name, email: admin.email, role: admin.role }
      });
    } else {
      res.status(401).json({ success: false, message: 'Invalid credentials or inactive account' });
    }
  } catch (error) { next(error); }
};

export const logout = (req, res) => {
  res.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(0),
  });
  res.json({ success: true, message: 'Logged out successfully' });
};

export const getMe = async (req, res, next) => {
  try {
    res.json({ success: true, data: req.admin });
  } catch (error) { next(error); }
};`);

// 5. authRoutes.js
fs.writeFileSync(path.join(routesPath, 'authRoutes.js'), `import express from 'express';
import { login, logout, getMe } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();
router.post('/login', login);
router.post('/logout', logout);
router.get('/me', protect, getMe);

export default router;`);

// 6. dashboardController.js
fs.writeFileSync(path.join(controllersPath, 'dashboardController.js'), `import Announcement from '../models/Announcement.js';
import Complaint from '../models/Complaint.js';
import Excom from '../models/Excom.js';
import Programme from '../models/Programme.js';
import Gallery from '../models/Gallery.js';

export const getDashboardStats = async (req, res, next) => {
  try {
    const announcements = await Announcement.countDocuments();
    const programmes = await Programme.countDocuments();
    const excom = await Excom.countDocuments();
    const gallery = await Gallery.countDocuments();
    const newComplaints = await Complaint.countDocuments({ status: 'New' });
    const resolvedComplaints = await Complaint.countDocuments({ status: 'Resolved' });
    
    res.json({
      success: true,
      data: { announcements, programmes, excom, gallery, newComplaints, resolvedComplaints }
    });
  } catch (error) { next(error); }
};`);

// 7. dashboardRoutes.js
fs.writeFileSync(path.join(routesPath, 'dashboardRoutes.js'), `import express from 'express';
import { getDashboardStats } from '../controllers/dashboardController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();
router.get('/stats', protect, getDashboardStats);

export default router;`);

// 8. seedAdmin.js
fs.writeFileSync(path.join(scriptsPath, 'seedAdmin.js'), `import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';
import Admin from '../models/Admin.js';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected for admin seeding');

    const name = process.env.ADMIN_NAME || 'Admin';
    const email = process.env.ADMIN_EMAIL || 'admin@example.com';
    const password = process.env.ADMIN_PASSWORD || 'password123';

    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      console.log('Admin already exists');
      process.exit(0);
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    await Admin.create({
      name,
      email,
      passwordHash,
      role: 'admin',
      isActive: true
    });

    console.log('Admin seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding admin:', error);
    process.exit(1);
  }
};
seedAdmin();`);

// 9. Update existing routes to use protect
const routesToProtect = {
  'announcementRoutes.js': "router.post('/', protect, announcementController.createAnnouncement);\nrouter.put('/:id', protect, announcementController.updateAnnouncement);\nrouter.delete('/:id', protect, announcementController.deleteAnnouncement);",
  'complaintRoutes.js': "router.get('/', protect, complaintController.getComplaints);\nrouter.get('/:id', protect, complaintController.getComplaintById);\nrouter.put('/:id', protect, complaintController.updateComplaint);\nrouter.delete('/:id', protect, complaintController.deleteComplaint);",
  'excomRoutes.js': "router.post('/', protect, excomController.createExcom);\nrouter.put('/:id', protect, excomController.updateExcom);\nrouter.delete('/:id', protect, excomController.deleteExcom);",
  'programmeRoutes.js': "router.post('/', protect, programmeController.createProgramme);\nrouter.put('/:id', protect, programmeController.updateProgramme);\nrouter.delete('/:id', protect, programmeController.deleteProgramme);",
  'galleryRoutes.js': "router.post('/', protect, galleryController.createGallery);\nrouter.put('/:id', protect, galleryController.updateGallery);\nrouter.delete('/:id', protect, galleryController.deleteGallery);"
};

for (const [file, replacement] of Object.entries(routesToProtect)) {
  const filePath = path.join(routesPath, file);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    if (!content.includes('import { protect }')) {
      content = content.replace("import express from 'express';", "import express from 'express';\nimport { protect } from '../middleware/authMiddleware.js';");
      // Replace the unprotected routes with protected ones
      // Use regex to replace the specific route bindings
      if (file === 'complaintRoutes.js') {
        content = content.replace(/router\.get\('\/', complaintController\.getComplaints\);/g, "router.get('/', protect, complaintController.getComplaints);");
        content = content.replace(/router\.get\('\/:id', complaintController\.getComplaintById\);/g, "router.get('/:id', protect, complaintController.getComplaintById);");
        content = content.replace(/router\.put\('\/:id', complaintController\.updateComplaint\);/g, "router.put('/:id', protect, complaintController.updateComplaint);");
        content = content.replace(/router\.delete\('\/:id', complaintController\.deleteComplaint\);/g, "router.delete('/:id', protect, complaintController.deleteComplaint);");
      } else {
        const controller = file.replace('Routes.js', 'Controller');
        content = content.replace(new RegExp(`router\\.post\\('\\/', ${controller}\\.create`, 'g'), `router.post('/', protect, ${controller}.create`);
        content = content.replace(new RegExp(`router\\.put\\('\\/:id', ${controller}\\.update`, 'g'), `router.put('/:id', protect, ${controller}.update`);
        content = content.replace(new RegExp(`router\\.delete\\('\\/:id', ${controller}\\.delete`, 'g'), `router.delete('/:id', protect, ${controller}.delete`);
      }
      fs.writeFileSync(filePath, content);
    }
  }
}

console.log('Admin backend setup complete.');

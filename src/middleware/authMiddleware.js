import jwt from 'jsonwebtoken';
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
};
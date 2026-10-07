import Admin from '../models/Admin.js';
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
      const isProduction = process.env.NODE_ENV === 'production';
      res.cookie('jwt', token, {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? 'none' : 'lax', // 'none' required for cross-domain cookies (Vercel -> Render)
        maxAge: 60 * 60 * 1000 // 1 hour
      });
      res.json({
        success: true,
        token, // Provide token so frontend can use localStorage/Authorization header if cookies are blocked by cross-site policies
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
};
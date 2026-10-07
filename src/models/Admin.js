import mongoose from 'mongoose';
const schema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  name: { type: String, required: true },
  role: { type: String, default: 'admin', enum: ['admin', 'superadmin'] },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });
export default mongoose.model('Admin', schema);
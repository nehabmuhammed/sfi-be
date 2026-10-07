import mongoose from 'mongoose';
const schema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });
export default mongoose.model('Announcement', schema);
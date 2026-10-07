import mongoose from 'mongoose';
const schema = new mongoose.Schema({
  image: { type: String, required: true },
  caption: { type: String },
  order: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });
export default mongoose.model('Gallery', schema);
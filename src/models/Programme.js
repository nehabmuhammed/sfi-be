import mongoose from 'mongoose';
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
export default mongoose.model('Programme', schema);
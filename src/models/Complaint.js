import mongoose from 'mongoose';
const schema = new mongoose.Schema({
  complaintId: { type: String, unique: true, required: true },
  category: { type: String, required: true },
  department: { type: String },
  complaint: { type: String, required: true },
  name: { type: String },
  email: { type: String, required: true, trim: true, lowercase: true },
  whatsapp: { type: String },
  anonymous: { type: Boolean, default: false },
  status: { type: String, default: 'New', enum: ['New', 'Under Review', 'Inspection', 'Verified', 'Not Verified', 'Action Taken', 'Resolved'] }
}, { timestamps: true });
export default mongoose.model('Complaint', schema);
import Complaint from '../models/Complaint.js';
import { sendComplaintConfirmationEmail, sendAdminComplaintNotification } from '../services/emailService.js';

const generateComplaintId = async () => {
  const currentYear = new Date().getFullYear();
  const prefix = `IGC-${currentYear}-`;
  
  const lastComplaint = await Complaint.findOne({ complaintId: new RegExp(`^${prefix}`) })
    .sort({ complaintId: -1 });

  let newSequence = 1;
  if (lastComplaint && lastComplaint.complaintId) {
    const lastSequence = parseInt(lastComplaint.complaintId.split('-')[2], 10);
    if (!isNaN(lastSequence)) {
      newSequence = lastSequence + 1;
    }
  }

  return `${prefix}${newSequence.toString().padStart(4, '0')}`;
};

export const createComplaint = async (req, res, next) => {
  try {
    const { category, department, complaint, name, email, whatsapp, anonymous } = req.body;
    
    // Basic email validation
    if (!email || !email.includes('@') || !email.includes('.')) {
      return res.status(400).json({ success: false, message: 'A valid email address is required' });
    }

    const complaintId = await generateComplaintId();

    const data = await Complaint.create({
      complaintId,
      category,
      department,
      complaint,
      name,
      email,
      whatsapp,
      anonymous,
      status: 'New'
    });

    // Send emails without awaiting their failure to block response
    await sendComplaintConfirmationEmail(data);
    await sendAdminComplaintNotification(data);

    res.status(201).json({ 
      success: true, 
      message: 'Complaint submitted successfully', 
      data: { complaintId: data.complaintId }
    });
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
};
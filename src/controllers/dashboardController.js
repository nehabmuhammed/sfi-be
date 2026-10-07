import Announcement from '../models/Announcement.js';
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
};
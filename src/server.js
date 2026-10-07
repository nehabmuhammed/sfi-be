import dotenv from 'dotenv';
import app from './app.js';
import connectDB from './config/db.js';

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 5000;

import Admin from './models/Admin.js';
import bcrypt from 'bcryptjs';

const autoSeedAdmin = async () => {
  try {
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@igc';
    const existing = await Admin.findOne({ email: adminEmail });
    if (!existing) {
      const password = process.env.ADMIN_PASSWORD || 'admin@union';
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password, salt);
      await Admin.create({
        name: process.env.ADMIN_NAME || 'Admin',
        email: adminEmail,
        passwordHash,
        role: 'admin',
        isActive: true
      });
      console.log(`Default admin (${adminEmail}) automatically initialized.`);
    }
  } catch (err) {
    console.error('Error during auto-seed admin:', err.message);
  }
};

const startServer = async () => {
  // Connect to MongoDB
  await connectDB();
  
  // Auto ensure admin user exists in DB
  await autoSeedAdmin();
  
  // Start Express server only after MongoDB connection succeeds
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();

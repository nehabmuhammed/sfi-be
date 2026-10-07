import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import authRoutes from './routes/authRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import announcementRoutes from './routes/announcementRoutes.js';
import complaintRoutes from './routes/complaintRoutes.js';
import excomRoutes from './routes/excomRoutes.js';
import programmeRoutes from './routes/programmeRoutes.js';
import galleryRoutes from './routes/galleryRoutes.js';
import { errorHandler } from './middleware/errorMiddleware.js';

const app = express();

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174'],
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin/dashboard', dashboardRoutes);
app.use('/api/announcements', announcementRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/excom', excomRoutes);
app.use('/api/programmes', programmeRoutes);
app.use('/api/gallery', galleryRoutes);

// Health Check Route
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: "IGC Union API is running"
  });
});

// Basic Error Handling Middleware
app.use(errorHandler);

export default app;

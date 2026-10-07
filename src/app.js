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
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  process.env.FRONTEND_URL,
  process.env.ADMIN_URL
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps, curl, postman)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1 || allowedOrigins.some(o => origin.startsWith(o))) {
      return callback(null, true);
    }
    // If running in development or matching vercel preview domains
    if (origin.endsWith('.vercel.app')) {
      return callback(null, true);
    }
    return callback(null, true); // Permissive in deployment to avoid blocking cross-site calls with credentials
  },
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

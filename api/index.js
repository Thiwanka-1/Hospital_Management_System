import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import path from 'path'; // Import the path module

import userRoutes from './routes/user.route.js';
import authRoutes from './routes/auth.route.js';
import doctorRoutes from './routes/doctor.route.js';
import appointmentRoutes from './routes/appointment.route.js'; // Import the new appointment routes
import reportRoutes from './routes/report.route.js';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config();

// Initialize the Express app
const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());

// Configure CORS
app.use(cors({
  origin: 'http://localhost:5173',  // Allow requests from your frontend domain
  credentials: true,                // Allow credentials like cookies, headers
}));

// MongoDB connection using Mongoose directly
mongoose.connect(process.env.MONGO, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Connected to MongoDB');
})
.catch((err) => {
  console.error('MongoDB connection error:', err);
  process.exit(1); // Exit the process if MongoDB connection fails
});

// Serve static files from the 'reports' directory
app.use('/reports', express.static(path.join(__dirname, 'reports'))); // Add this line to serve the reports

// Routes (make sure your routes are properly set up and imported)
app.use("/api/user", userRoutes);  // User management routes
app.use("/api/auth", authRoutes);  // Authentication routes
app.use('/api/doctors', doctorRoutes);  // Doctor management routes
app.use('/api/appointments', appointmentRoutes); // Appointment management routes
app.use('/api/reports', reportRoutes); // Report routes

// Global error handling middleware
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal server error';
  return res.status(statusCode).json({
    success: false,
    message,
    statusCode,
  });
});

// Start the server
const PORT = process.env.PORT || 3000; // Use PORT from .env or default to 3000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

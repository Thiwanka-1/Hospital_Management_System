import express from 'express';
import { 
  uploadReport, 
  getReports, 
  updateReport, 
  deleteReport } from '../controllers/report.controller.js';
import { verifyToken, verifyDoctor } from '../utils/verifyUser.js'; // Assume verifyDoctor checks if the user is a doctor
import multer from 'multer'; // Middleware for handling file uploads

// Set the destination folder for file uploads

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './reports')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now()
    cb(null,uniqueSuffix + '-' + file.originalname)
  }
})

const upload = multer({ storage: storage })
const router = express.Router();

// POST: Doctor uploads a report
router.post('/upload', verifyToken, verifyDoctor, upload.single('reportFile'), uploadReport);

// GET: Patient gets their own reports
router.get('/patient', verifyToken, getReports);

// PUT: Doctor updates a report
router.put('/:reportId', verifyToken, verifyDoctor, upload.single('reportFile'), updateReport);

// DELETE: Doctor deletes a report
router.delete('/:reportId', verifyToken, verifyDoctor, deleteReport);

export default router;

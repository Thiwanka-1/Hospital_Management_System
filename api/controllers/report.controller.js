// controllers/report.controller.js
import Report from '../models/report.model.js';
import { errorHandler } from '../utils/error.js';
import fs from 'fs';
import path from 'path';

// File type validation: Check if the file is a PDF or image
const isValidFileType = (file) => {
    const validMimeTypes = ['application/pdf', 'image/jpeg', 'image/png'];
    return validMimeTypes.includes(file.mimetype);
};

// Upload a report (Doctors only)
export const uploadReport = async (req, res, next) => {
    const { patientId, reportType, testType, reportIssuedDate } = req.body;
    const doctorId = req.user.id; // Assuming the doctor is authenticated

    if (!patientId || !reportType || !testType || !reportIssuedDate || !req.file) {
        return next(errorHandler(400, 'All fields are required, including the file.'));
    }

    if (!isValidFileType(req.file)) {
        return next(errorHandler(400, 'Invalid file type. Only PDF or image files are allowed.'));
    }

    try {
        const newReport = new Report({
            doctor: doctorId,
            patient: patientId,
            reportFile: req.file.path,
            reportType,
            testType,
            reportIssuedDate,
        });
        await newReport.save();
        res.status(201).json({ message: 'Report uploaded successfully', report: newReport });
    } catch (error) {
        console.error('Error saving report:', error);
        next(error);
    }
};


// Get all reports for a patient (Patient can only see their own reports)
export const getReports = async (req, res, next) => {
    const userId = req.user.id; // Assuming user is authenticated
    try {
        const reports = await Report.find({ patient: userId }).populate('doctor', 'name specialization');
        res.status(200).json(reports);
    } catch (error) {
        next(error);
    }
};

// Update a report (Doctors only)
export const updateReport = async (req, res, next) => {
    const { reportId } = req.params;
    const { reportType, testType, reportIssuedDate } = req.body;
    const doctorId = req.user.id;

    try {
        const report = await Report.findById(reportId);
        if (!report) return next(errorHandler(404, 'Report not found'));
        if (report.doctor.toString() !== doctorId) return next(errorHandler(403, 'Unauthorized'));

        // Update report details if provided
        if (reportType) report.reportType = reportType;
        if (testType) report.testType = testType;
        if (reportIssuedDate) report.reportIssuedDate = reportIssuedDate;

        if (req.file) {
            if (!isValidFileType(req.file)) {
                return next(errorHandler(400, 'Invalid file type. Only PDF or image files are allowed.'));
            }

            // Delete the old file
            fs.unlinkSync(path.join(__dirname, '..', report.reportFile));
            report.reportFile = req.file.path;
        }

        await report.save();
        res.status(200).json({ message: 'Report updated successfully', report });
    } catch (error) {
        next(error);
    }
};

// Delete a report (Doctors only)
export const deleteReport = async (req, res, next) => {
    const { reportId } = req.params;
    const doctorId = req.user.id;

    try {
        const report = await Report.findById(reportId);
        if (!report) return next(errorHandler(404, 'Report not found'));
        if (report.doctor.toString() !== doctorId) return next(errorHandler(403, 'Unauthorized'));

        // Delete the report file
        fs.unlinkSync(path.join(__dirname, '..', report.reportFile));

        await Report.findByIdAndDelete(reportId);
        res.status(200).json({ message: 'Report deleted successfully' });
    } catch (error) {
        next(error);
    }
};

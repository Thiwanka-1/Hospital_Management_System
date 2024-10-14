import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';

const UploadReportForm = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { userName, patientId } = location.state; // Retrieve patientId from passed state

    const [reportType, setReportType] = useState('');
    const [testType, setTestType] = useState('');
    const [reportIssuedDate, setReportIssuedDate] = useState('');
    const [reportFile, setReportFile] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    // Handle radio buttons for test type
    const handleRadioChange = (e) => {
        setTestType(e.target.value);
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('patientId', patientId);
        formData.append('reportType', reportType);
        formData.append('testType', testType);
        formData.append('reportIssuedDate', reportIssuedDate);
        formData.append('reportFile', reportFile);

        try {
            const res = await axios.post('/api/reports/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                withCredentials: true,
            });

            if (res.data.success) {
                setSuccessMessage('Your report has been submitted successfully.');
                setTimeout(() => {
                    navigate('/ViewReports'); // Redirect after success
                }, 3000);
            }
        } catch (err) {
            console.error('Error during form submission:', err);
            setErrorMessage('There was an error submitting your report. Please try again.');
        }
    };

    // Render test type options based on report type selection
    const renderTestTypes = () => {
        switch (reportType) {
            case 'Lab Report':
                return (
                    <>
                        <label className="inline-flex items-center">
                            <input
                                type="radio"
                                name="testType"
                                value="Blood Count"
                                onChange={handleRadioChange}
                                className="mr-2"
                            />
                            Blood Count
                        </label>
                        <label className="inline-flex items-center">
                            <input
                                type="radio"
                                name="testType"
                                value="Urin Test"
                                onChange={handleRadioChange}
                                className="mr-2"
                            />
                            Urin Test
                        </label>
                        <label className="inline-flex items-center">
                            <input
                                type="radio"
                                name="testType"
                                value="Tumor Markers"
                                onChange={handleRadioChange}
                                className="mr-2"
                            />
                            Tumor Markers
                        </label>
                    </>
                );
            case 'Radiology Report':
                return (
                    <>
                        <label className="inline-flex items-center">
                            <input
                                type="radio"
                                name="testType"
                                value="X-Ray"
                                onChange={handleRadioChange}
                                className="mr-2"
                            />
                            X-Ray
                        </label>
                        <label className="inline-flex items-center">
                            <input
                                type="radio"
                                name="testType"
                                value="MRI"
                                onChange={handleRadioChange}
                                className="mr-2"
                            />
                            MRI
                        </label>
                        <label className="inline-flex items-center">
                            <input
                                type="radio"
                                name="testType"
                                value="CT Scan"
                                onChange={handleRadioChange}
                                className="mr-2"
                            />
                            CT Scan
                        </label>
                    </>
                );
            case 'Pathology Report':
                return (
                    <>
                        <label className="inline-flex items-center">
                            <input
                                type="radio"
                                name="testType"
                                value="Anatomical Pathology"
                                onChange={handleRadioChange}
                                className="mr-2"
                            />
                            Anatomical Pathology
                        </label>
                        <label className="inline-flex items-center">
                            <input
                                type="radio"
                                name="testType"
                                value="Clinical Pathology"
                                onChange={handleRadioChange}
                                className="mr-2"
                            />
                            Clinical Pathology
                        </label>
                        <label className="inline-flex items-center">
                            <input
                                type="radio"
                                name="testType"
                                value="Molecular Pathology"
                                onChange={handleRadioChange}
                                className="mr-2"
                            />
                            Molecular Pathology
                        </label>
                    </>
                );
            default:
                return null;
        }
    };

    return (
        <div>
            {/* Form Title */}
            <h2 className="text-2xl font-bold text-center mb-6">Upload Medical Records</h2>

            {/* Form Content */}
            <form onSubmit={handleSubmit} className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-lg space-y-6">
                {/* Patient Name (read-only) */}
                <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">Patient Name</label>
                    <input
                        type="text"
                        value={userName}
                        readOnly
                        className="w-full p-2 border border-gray-300 rounded-md bg-gray-100"
                    />
                </div>

                {/* Report Type Dropdown */}
                <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">Report Type</label>
                    <select
                        value={reportType}
                        onChange={(e) => setReportType(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">Select Report Type</option>
                        <option value="Lab Report">Lab Report</option>
                        <option value="Radiology Report">Radiology Report</option>
                        <option value="Pathology Report">Pathology Report</option>
                    </select>
                </div>

                {/* Test Type Radio Buttons */}
                <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">Test Type</label>
                    <div className="flex flex-wrap gap-2">
                        {renderTestTypes()}
                    </div>
                </div>

                {/* Report Issue Date */}
                <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">Report Issue Date</label>
                    <input
                        type="date"
                        value={reportIssuedDate}
                        onChange={(e) => setReportIssuedDate(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* File Upload */}
                <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">Upload Report</label>
                    <input
                        type="file"
                        accept=".pdf, image/*" // Accept only PDFs and images
                        onChange={(e) => setReportFile(e.target.files[0])}
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* Success/Error Message */}
                {successMessage && <p className="text-green-600">{successMessage}</p>}
                {errorMessage && <p className="text-red-600">{errorMessage}</p>}

                {/* Submit Button */}
                <button
                    type="submit"
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md transition duration-300 ease-in-out"
                >
                    Submit
                </button>
            </form>
        </div>
    );
};

export default UploadReportForm;

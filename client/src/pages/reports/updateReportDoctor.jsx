import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const UpdateReportForm = () => {
    const { reportId } = useParams(); // Retrieve report ID from URL params
    const navigate = useNavigate();

    const [userName, setUserName] = useState('');
    const [reportType, setReportType] = useState('');
    const [testType, setTestType] = useState('');
    const [reportIssuedDate, setReportIssuedDate] = useState('');
    const [reportFile, setReportFile] = useState(null);

    // Fetch the existing report details
    useEffect(() => {
        const fetchReport = async () => {
            try {
                const res = await axios.get(`/api/reports/${reportId}`, { withCredentials: true });
                const report = res.data;
                setUserName(report.patient.name);
                setReportType(report.reportType);
                setTestType(report.testType);
                setReportIssuedDate(report.reportIssuedDate.slice(0, 10)); // Format date for input field
            } catch (err) {
                console.error('Error fetching report details:', err);
                alert('Failed to load report details. Please try again.');
            }
        };

        fetchReport();
    }, [reportId]);

    // Handle form submission for updating the report
    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('reportType', reportType);
        formData.append('testType', testType);
        formData.append('reportIssuedDate', reportIssuedDate);
        if (reportFile) formData.append('reportFile', reportFile);

        try {
            const res = await axios.put(`/api/reports/${reportId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                withCredentials: true,
            });

            if (res.data.message) {
                alert('Your report has been updated successfully.');
                navigate('/view-Reports-doctor'); // Redirect to view reports
            }
        } catch (err) {
            console.error('Error updating report:', err);
            alert('There was an error updating your report. Please try again.');
        }
    };

    // Render test type options based on selected report type
    const renderTestTypes = () => {
        switch (reportType) {
            case 'Lab Report':
                return (
                    <>
                        <label>
                            <input
                                type="radio"
                                name="testType"
                                value="Blood Count"
                                checked={testType === 'Blood Count'}
                                onChange={(e) => setTestType(e.target.value)}
                                className="mr-2"
                            />
                            Blood Count
                        </label>
                        <label>
                            <input
                                type="radio"
                                name="testType"
                                value="Urin Test"
                                checked={testType === 'Urin Test'}
                                onChange={(e) => setTestType(e.target.value)}
                                className="mr-2"
                            />
                            Urin Test
                        </label>
                        <label>
                            <input
                                type="radio"
                                name="testType"
                                value="Tumor Markers"
                                checked={testType === 'Tumor Markers'}
                                onChange={(e) => setTestType(e.target.value)}
                                className="mr-2"
                            />
                            Tumor Markers
                        </label>
                    </>
                );
            case 'Radiology Report':
                return (
                    <>
                        <label>
                            <input
                                type="radio"
                                name="testType"
                                value="X-Ray"
                                checked={testType === 'X-Ray'}
                                onChange={(e) => setTestType(e.target.value)}
                                className="mr-2"
                            />
                            X-Ray
                        </label>
                        <label>
                            <input
                                type="radio"
                                name="testType"
                                value="MRI"
                                checked={testType === 'MRI'}
                                onChange={(e) => setTestType(e.target.value)}
                                className="mr-2"
                            />
                            MRI
                        </label>
                        <label>
                            <input
                                type="radio"
                                name="testType"
                                value="CT Scan"
                                checked={testType === 'CT Scan'}
                                onChange={(e) => setTestType(e.target.value)}
                                className="mr-2"
                            />
                            CT Scan
                        </label>
                    </>
                );
            case 'Pathology Report':
                return (
                    <>
                        <label>
                            <input
                                type="radio"
                                name="testType"
                                value="Anatomical Pathology"
                                checked={testType === 'Anatomical Pathology'}
                                onChange={(e) => setTestType(e.target.value)}
                                className="mr-2"
                            />
                            Anatomical Pathology
                        </label>
                        <label>
                            <input
                                type="radio"
                                name="testType"
                                value="Clinical Pathology"
                                checked={testType === 'Clinical Pathology'}
                                onChange={(e) => setTestType(e.target.value)}
                                className="mr-2"
                            />
                            Clinical Pathology
                        </label>
                        <label>
                            <input
                                type="radio"
                                name="testType"
                                value="Molecular Pathology"
                                checked={testType === 'Molecular Pathology'}
                                onChange={(e) => setTestType(e.target.value)}
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
        <div className="container mx-auto p-6">
            <h2 className="text-2xl font-bold text-center mb-6">Update Medical Record</h2>

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
                    <label className="block text-gray-700 text-sm font-bold mb-2">Upload New Report (optional)</label>
                    <input
                        type="file"
                        accept=".pdf, image/*"
                        onChange={(e) => setReportFile(e.target.files[0])}
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md transition duration-300 ease-in-out"
                >
                    Update Report
                </button>
            </form>
        </div>
    );
};

export default UpdateReportForm;

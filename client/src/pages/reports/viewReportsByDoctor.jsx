import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ViewReportsByDoctor = () => {
    const [reports, setReports] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        // Fetch reports uploaded by the logged-in doctor
        const fetchReports = async () => {
            try {
                const response = await axios.get('/api/reports/doctor', { withCredentials: true });
                setReports(response.data);
            } catch (error) {
                console.error('Error fetching reports:', error);
                setErrorMessage('Failed to fetch reports. Please try again later.');
            }
        };

        fetchReports();
    }, []);

    // Function to handle updating a report
    const handleUpdate = (reportId) => {
        // Navigate to the update page for the specific report
        window.location.href = `/update-reports-doctor/${reportId}`;
    };

    // Function to handle deleting a report
    const handleDelete = async (reportId) => {
        try {
            await axios.delete(`/api/reports/${reportId}`, { withCredentials: true });
            // Remove the deleted report from the state
            setReports(reports.filter((report) => report._id !== reportId));
        } catch (error) {
            console.error('Error deleting report:', error);
            setErrorMessage('Failed to delete the report. Please try again later.');
        }
    };

    return (
        <div className="container mx-auto p-6">
            <h2 className="text-2xl font-bold text-center mb-6">My Uploaded Reports</h2>

            {errorMessage && <p className="text-red-600 text-center">{errorMessage}</p>}

            {reports.length > 0 ? (
                <table className="table-auto w-full">
                    <thead>
                        <tr>
                            <th className="px-4 py-2">Patient Name</th>
                            <th className="px-4 py-2">Report Type</th>
                            <th className="px-4 py-2">Test Type</th>
                            <th className="px-4 py-2">Issue Date</th>
                            <th className="px-4 py-2">View Report</th>
                            <th className="px-4 py-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reports.map((report) => (
                            <tr key={report._id}>
                                <td className="border px-4 py-2">{report.patient?.name || 'N/A'}</td>
                                <td className="border px-4 py-2">{report.reportType}</td>
                                <td className="border px-4 py-2">{report.testType}</td>
                                <td className="border px-4 py-2">{new Date(report.reportIssuedDate).toLocaleDateString()}</td>
                                <td className="border px-4 py-2">
                                    <a
                                        href={`http://localhost:3000/reports/${encodeURIComponent(report.reportFile.split('/').pop())}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:underline"
                                    >
                                        View Report
                                    </a>
                                </td>
                                <td className="border px-4 py-2">
                                    <button
                                        onClick={() => handleUpdate(report._id)}
                                        className="bg-yellow-500 text-white px-2 py-1 mr-2 rounded hover:bg-yellow-600"
                                    >
                                        Update
                                    </button>
                                    <button
                                        onClick={() => handleDelete(report._id)}
                                        className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p className="text-center">No reports found.</p>
            )}
        </div>
    );
};

export default ViewReportsByDoctor;

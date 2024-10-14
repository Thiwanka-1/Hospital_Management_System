import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ViewReport = () => {
  const [reports, setReports] = useState([]);

  // Fetch all reports uploaded by the logged-in doctor
  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const response = await axios.get('/api/reports/doctor');  // Fetch reports by the logged-in doctor
      setReports(response.data);
    } catch (error) {
      console.error('Error fetching reports:', error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <h2 className="text-2xl font-semibold mb-6 text-center">Uploaded Reports</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {reports.map((report) => (
          <div key={report._id} className="bg-white shadow-lg rounded-lg p-6">
            <div className="mb-4">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Patient: {report.patientName}</h3>
              <p className="text-gray-600">Type: {report.reportType}</p>
              <p className="text-gray-600">Test: {report.testName}</p>
              <p className="text-gray-600">Date: {new Date(report.reportDate).toLocaleDateString()}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ViewReport;

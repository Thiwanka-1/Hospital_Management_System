import { useEffect, useState } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function DoctorList() {
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    const fetchDoctors = async () => {
      const response = await axios.get('/api/doctors');
      setDoctors(response.data);
    };

    fetchDoctors();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/doctors/delete/${id}`);
      setDoctors(doctors.filter(doctor => doctor._id !== id));
      alert('Doctor deleted successfully');
    } catch (err) {
      console.error(err);
      alert('Error deleting doctor');
    }
  };

  const generateReport = () => {
    const doc = new jsPDF();
    const tableColumn = ["Name", "Specialization", "Email", "Channeling Cost", "Available Days"];
    const tableRows = [];

    doctors.forEach(doctor => {
      const doctorData = [
        doctor.name,
        doctor.specialization,
        doctor.email,
        doctor.channelingCost,
        doctor.availableDates.join(', ')
      ];
      tableRows.push(doctorData);
    });

    doc.autoTable(tableColumn, tableRows, { startY: 20 });
    doc.text("Doctors Report", 14, 15);
    doc.save("doctors_report.pdf");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-5">
      <div className="bg-white shadow- rounded-lg p-8 w-full max-w-7xl mb-72">
        <h1 className="text-2xl font-bold text-center text-gray-700 mb-6">Doctors List</h1>
        <button
          onClick={generateReport}
          className="mb-4 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-200"
        >
          Generate Report (PDF)
        </button>
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="py-3 px-4 border-b border-gray-300 text-left text-gray-600">Name</th>
              <th className="py-3 px-4 border-b border-gray-300 text-left text-gray-600">Specialization</th>
              <th className="py-3 px-4 border-b border-gray-300 text-left text-gray-600">Email</th>
              <th className="py-3 px-4 border-b border-gray-300 text-left text-gray-600">Channeling Cost</th>
              <th className="py-3 px-4 border-b border-gray-300 text-left text-gray-600">Available Days</th>
              <th className="py-3 px-4 border-b border-gray-300 text-left text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {doctors.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-4">No doctors added yet.</td>
              </tr>
            ) : (
              doctors.map(doctor => (
                <tr key={doctor._id} className="hover:bg-gray-100">
                  <td className="py-3 px-4 border-b border-gray-300">Dr. {doctor.name}</td>
                  <td className="py-3 px-4 border-b border-gray-300">{doctor.specialization}</td>
                  <td className="py-3 px-4 border-b border-gray-300">{doctor.email}</td>
                  <td className="py-3 px-4 border-b border-gray-300">{doctor.channelingCost}</td>
                  <td className="py-3 px-4 border-b border-gray-300">{doctor.availableDates.join(', ')}</td>
                  <td className="py-3 px-4 border-b border-gray-300">
                    <button
                      onClick={() => handleDelete(doctor._id)}
                      className="bg-red-500 text-white py-1 px-2 rounded-md hover:bg-red-600 transition duration-200"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

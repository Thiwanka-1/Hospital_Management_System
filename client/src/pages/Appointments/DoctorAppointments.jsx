// DoctorAppointments.js
import React, { useEffect, useState } from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { useSelector } from 'react-redux';

const DoctorAppointments = () => {
    const { currentUser } = useSelector((state) => state.user);
    const [appointments, setAppointments] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');

    const doctorId = currentUser.isDoctor ? currentUser._id : '';

    const fetchDoctorAppointments = async () => {
        try {
            const response = await fetch(`/api/appointments/doctor/${doctorId}`);
            if (!response.ok) throw new Error('Failed to fetch appointments');

            const data = await response.json();
            if (data.length > 0) {
                setAppointments(data);
            } else {
                setErrorMessage('No appointments found.');
            }
        } catch (error) {
            setErrorMessage(error.message);
            console.error('Error fetching doctor appointments:', error);
        }
    };

    const generatePDF = () => {
        const doc = new jsPDF();
        doc.setFontSize(20);
        doc.text('Doctor Appointment Report', 14, 22);
        doc.autoTable({
            startY: 30,
            head: [['Patient Name', 'Date', 'Time', 'Channeling Cost']],
            body: appointments.map(appointment => [
                appointment.patientName, // Use patientName here
                new Date(appointment.date).toLocaleDateString(),
                appointment.time,
                appointment.channelingCost,
            ]),
        });
        doc.save('doctor_appointments.pdf');
    };

    useEffect(() => {
        if (doctorId) {
            fetchDoctorAppointments();
        }
    }, [doctorId]);

    return (
        <div className="container mx-auto py-8">
            <h2 className="text-2xl font-bold text-center">My Appointments</h2>
            {errorMessage && <p className="text-red-500 text-sm text-center">{errorMessage}</p>}
            <button
                onClick={generatePDF}
                className="mb-4 bg-indigo-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-indigo-700"
            >
                Generate PDF Report
            </button>
            <table className="min-w-full mt-6 bg-white shadow-md rounded-lg overflow-hidden">
                <thead>
                    <tr className="w-full bg-indigo-600 text-white">
                        <th className="py-2 px-4">Patient</th>
                        <th className="py-2 px-4">Date</th>
                        <th className="py-2 px-4">Time</th>
                        <th className="py-2 px-4">Channeling Cost</th>
                    </tr>
                </thead>
                <tbody>
                    {appointments.map(appointment => (
                        <tr key={appointment._id} className="border-b">
                            <td className="py-2 px-4">{appointment.patientName}</td>
                            <td className="py-2 px-4">{new Date(appointment.date).toLocaleDateString()}</td>
                            <td className="py-2 px-4">{appointment.time}</td>
                            <td className="py-2 px-4">${appointment.channelingCost}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default DoctorAppointments;

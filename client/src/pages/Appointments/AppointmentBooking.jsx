// AppointmentBooking.js
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const specializations = [
    'Cardiology', 'Dermatology', 'Endocrinology', 'Gastroenterology',
    'General Surgery', 'Gynecology', 'Hematology', 'Neurology',
    'Oncology', 'Ophthalmology', 'Orthopedics', 'Pediatrics',
    'Psychiatry', 'Radiology', 'Urology', 'Family Medicine',
    'Internal Medicine', 'Pulmonology', 'Rheumatology',
    'Anesthesiology', 'Pathology',
];

const AppointmentBooking = () => {
    const { currentUser } = useSelector((state) => state.user);
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedSpecialization, setSelectedSpecialization] = useState('');
    const [filteredDoctors, setFilteredDoctors] = useState([]);
    const [selectedDoctor, setSelectedDoctor] = useState('');
    const [patientName, setPatientName] = useState(''); // New state for patient name
    const [appointmentDetails, setAppointmentDetails] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const fetchAvailableDoctors = async () => {
        if (!selectedDate || !selectedSpecialization) return;

        const response = await fetch(`/api/appointments/available?date=${selectedDate}&specialization=${selectedSpecialization}`);
        const data = await response.json();

        if (data.length > 0) {
            setFilteredDoctors(data);
            setErrorMessage('');
        } else {
            setFilteredDoctors([]);
            setErrorMessage('No doctors available for the selected date and specialization.');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!selectedDoctor) {
            setErrorMessage('Please select a doctor.');
            return;
        }

        const userId = currentUser._id;
        if (!userId) {
            console.error('Invalid user ID');
            return;
        }

        const appointmentData = {
            userId: userId,
            doctorId: selectedDoctor,
            date: selectedDate,
            channelingCost: filteredDoctors.find(doc => doc._id === selectedDoctor).channelingCost,
            patientName, // Include patient name
        };

        const response = await fetch('/api/appointments', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(appointmentData),
        });

        const result = await response.json();
        if (result.success) {
            setAppointmentDetails(result.newAppointment);
        } else {
            setErrorMessage(result.message);
        }
    };

    useEffect(() => {
        fetchAvailableDoctors();
    }, [selectedDate, selectedSpecialization]);

    return (
        <div className="container mx-auto py-8">
            <h2 className="text-2xl font-bold text-center">Book an Appointment</h2>
            <form onSubmit={handleSubmit} className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-md mt-6">
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Patient Name</label>
                    <input
                        type="text"
                        value={patientName}
                        onChange={(e) => setPatientName(e.target.value)}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring focus:ring-indigo-200"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Select Date</label>
                    <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring focus:ring-indigo-200"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Specialization</label>
                    <select
                        value={selectedSpecialization}
                        onChange={(e) => setSelectedSpecialization(e.target.value)}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring focus:ring-indigo-200"
                        required
                    >
                        <option value="">Select Specialization</option>
                        {specializations.map((spec) => (
                            <option key={spec} value={spec}>{spec}</option>
                        ))}
                    </select>
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Select Doctor</label>
                    <select
                        value={selectedDoctor}
                        onChange={(e) => setSelectedDoctor(e.target.value)}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring focus:ring-indigo-200"
                        required
                    >
                        <option value="">Select Doctor</option>
                        {filteredDoctors.map((doctor) => (
                            <option key={doctor._id} value={doctor._id}>{doctor.name}</option>
                        ))}
                    </select>
                </div>
                {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}
                <button type="submit" className="mt-4 w-full bg-indigo-600 text-white font-semibold py-2 rounded-md hover:bg-indigo-700">
                    Book Appointment
                </button>
            </form>

            {/* Appointment Details Popup */}
            {appointmentDetails && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h3 className="text-lg font-semibold">Appointment Confirmed</h3>
                        <p>Patient: {appointmentDetails.patientName}</p> {/* Show patient name */}
                        <p>Doctor: {appointmentDetails.doctorId.name}</p>
                        <p>Date: {new Date(appointmentDetails.date).toLocaleDateString()}</p>
                        <p>Appointment Number: {appointmentDetails.appointmentNumber}</p>
                        <p>Channeling Cost: ${appointmentDetails.channelingCost}</p>
                        <p>Time: {appointmentDetails.time}</p>
                        <button
                            onClick={() => setAppointmentDetails(null)}
                            className="mt-4 bg-indigo-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-indigo-700"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AppointmentBooking;

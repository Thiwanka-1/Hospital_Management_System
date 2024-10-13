// UpdateAppointment.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const specializations = [
    'Cardiology', 'Dermatology', 'Endocrinology', 'Gastroenterology',
    'General Surgery', 'Gynecology', 'Hematology', 'Neurology',
    'Oncology', 'Ophthalmology', 'Orthopedics', 'Pediatrics',
    'Psychiatry', 'Radiology', 'Urology', 'Family Medicine',
    'Internal Medicine', 'Pulmonology', 'Rheumatology',
    'Anesthesiology', 'Pathology',
];

const UpdateAppointment = () => {
    const { id } = useParams();
    const { currentUser } = useSelector((state) => state.user);
    const [doctors, setDoctors] = useState([]);
    const [selectedDoctor, setSelectedDoctor] = useState('');
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedSpecialization, setSelectedSpecialization] = useState('');
    const [filteredDoctors, setFilteredDoctors] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDoctors = async () => {
            const response = await fetch('http://localhost:3000/api/doctors');
            const data = await response.json();
            setDoctors(data);
        };
        fetchDoctors();
    }, []);

    const fetchAvailableDoctors = async () => {
        if (!selectedDate || !selectedSpecialization) return;

        const response = await fetch(`http://localhost:3000/api/appointments/available?date=${selectedDate}&specialization=${selectedSpecialization}`);
        if (response.ok) {
            const data = await response.json();
            setFilteredDoctors(data);
        } else {
            setErrorMessage('Error fetching available doctors');
        }
    };

    useEffect(() => {
        fetchAvailableDoctors();
    }, [selectedDate, selectedSpecialization]);

    const handleSpecializationChange = (e) => {
        setSelectedSpecialization(e.target.value);
        setSelectedDoctor('');
    };

    const handleDateChange = (e) => {
        setSelectedDate(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!selectedDoctor) {
            setErrorMessage('Please select a doctor.');
            return;
        }

        const appointmentData = {
            userId: currentUser._id,
            doctorId: selectedDoctor,
            date: selectedDate,
            channelingCost: filteredDoctors.find(doc => doc._id === selectedDoctor)?.channelingCost,
        };

        const response = await fetch(`http://localhost:3000/api/appointments/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(appointmentData),
        });

        const result = await response.json();
        if (result.success) {
            navigate('/appointments/my');
        } else {
            setErrorMessage(result.message);
        }
    };

    return (
        <div className="container mx-auto py-8">
            <h2 className="text-2xl font-bold text-center">Update Appointment</h2>
            {errorMessage && <p className="text-red-500 text-sm text-center">{errorMessage}</p>}
            <form onSubmit={handleSubmit} className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-md mt-6">
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Select Date</label>
                    <input
                        type="date"
                        value={selectedDate}
                        onChange={handleDateChange}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring focus:ring-indigo-200"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Specialization</label>
                    <select
                        value={selectedSpecialization}
                        onChange={handleSpecializationChange}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring focus:ring-indigo-200"
                        required
                    >
                        <option value="">Select Specialization</option>
                        {specializations.map(spec => (
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
                <button type="submit" className="mt-4 w-full bg-indigo-600 text-white font-semibold py-2 rounded-md hover:bg-indigo-700">
                    Update Appointment
                </button>
            </form>
        </div>
    );
};

export default UpdateAppointment;

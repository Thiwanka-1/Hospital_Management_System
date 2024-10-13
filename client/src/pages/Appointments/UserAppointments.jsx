// UserAppointments.jsx
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const UserAppointments = () => {
    const [appointments, setAppointments] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const { currentUser } = useSelector((state) => state.user);
    const userId = currentUser ? currentUser._id : null;

    // Fetch user appointments
    const fetchUserAppointments = async () => {
        if (!userId) {
            setErrorMessage('User not logged in');
            return;
        }

        const response = await fetch(`/api/appointments/user/${userId}`);
        if (response.ok) {
            const data = await response.json();
            if (data.length > 0) {
                setAppointments(data);
            } else {
                setErrorMessage('No appointments found.');
            }
        } else {
            setErrorMessage('Error fetching appointments.');
        }
    };

    useEffect(() => {
        fetchUserAppointments();
    }, [userId]);

    const handleCancel = async (id) => {
        const response = await fetch(`/api/appointments/${id}`, {
            method: 'DELETE',
        });

        if (response.ok) {
            setAppointments(appointments.filter(appointment => appointment._id !== id));
        } else {
            setErrorMessage('Error canceling appointment.');
        }
    };

    return (
        <div className="container mx-auto py-8">
            <h2 className="text-2xl font-bold text-center">My Appointments</h2>
            {errorMessage && <p className="text-red-500 text-sm text-center">{errorMessage}</p>}
            <table className="min-w-full mt-6 bg-white shadow-md rounded-lg overflow-hidden">
                <thead>
                    <tr className="w-full bg-indigo-600 text-white">
                        <th className="py-2 px-4">Appointment Number</th>
                        <th className="py-2 px-4">Doctor</th>
                        <th className="py-2 px-4">Specialization</th>
                        <th className="py-2 px-4">Date</th>
                        <th className="py-2 px-4">Time Range</th>
                        <th className="py-2 px-4">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {appointments.map(appointment => (
                        <tr key={appointment._id} className="border-b">
                            <td className="py-2 px-4">{appointment.appointmentNumber}</td>
                            <td className="py-2 px-4">{appointment.doctorId.name}</td>
                            <td className="py-2 px-4">{appointment.doctorId.specialization}</td>
                            <td className="py-2 px-4">{new Date(appointment.date).toLocaleDateString()}</td>
                            <td className="py-2 px-4">
                                {appointment.doctorId.timeRanges.length > 0 
                                    ? `${appointment.doctorId.timeRanges[0].from} - ${appointment.doctorId.timeRanges[0].to}` 
                                    : 'Time not available'}
                            </td>
                            <td className="py-2 px-4">
                                <Link
                                    to={`/appointments/update/${appointment._id}`} 
                                    className="text-blue-600 hover:underline mr-4"
                                >
                                    Update
                                </Link>
                                <button
                                    onClick={() => handleCancel(appointment._id)}
                                    className="text-red-600 hover:underline"
                                >
                                    Cancel
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default UserAppointments;

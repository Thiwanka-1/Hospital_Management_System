// appointment.controller.js
import Appointment from '../models/appointment.model.js';
import Doctor from '../models/doctor.model.js';
import User from '../models/user.model.js';


export const createAppointment = async (req, res) => {
    const { userId, doctorId, date, channelingCost, patientName } = req.body; // Include patientName

    try {
        const doctor = await Doctor.findById(doctorId);
        if (!doctor) return res.status(404).json({ success: false, message: 'Doctor not found' });

        const appointmentCount = await Appointment.countDocuments({
            doctorId,
            date,
            status: 'upcoming',
        });

        if (appointmentCount >= doctor.maxAppointmentsPerDay) {
            return res.status(400).json({ success: false, message: 'No available slots for this date' });
        }

        const appointmentDay = new Date(date).toLocaleString('en-US', { weekday: 'long' }).toLowerCase();
        const timeRange = doctor.timeRanges.find(range => range.day.toLowerCase() === appointmentDay);
        
        if (!timeRange) {
            return res.status(400).json({ success: false, message: 'Doctor not available on this date' });
        }

        const newAppointment = new Appointment({
            userId,
            doctorId,
            date,
            time: timeRange.from,
            appointmentNumber: appointmentCount + 1,
            channelingCost,
            patientName, // Save patient name
        });

        await newAppointment.save();
        res.status(201).json({ success: true, message: 'Appointment booked successfully', newAppointment });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Error creating appointment', error: error.message });
    }
};

// Get appointments for a specific user
export const getUserAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.find({ userId: req.params.userId })
            .populate('doctorId', 'name specialization timeRanges'); // Populate doctor details
        res.json(appointments);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching appointments', error: err.message });
    }
};

// Update an appointment
export const updateAppointment = async (req, res) => {
    try {
        const updatedAppointment = await Appointment.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedAppointment) return res.status(404).json({ message: 'Appointment not found' });
        res.json({ message: 'Appointment updated successfully', updatedAppointment });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error updating appointment', error: error.message });
    }
};

// Delete an appointment
export const deleteAppointment = async (req, res) => {
    try {
        const appointment = await Appointment.findByIdAndDelete(req.params.id);
        if (!appointment) return res.status(404).json({ message: 'Appointment not found' });
        res.json({ message: 'Appointment canceled successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error deleting appointment', error: error.message });
    }
};

// Get available doctors for a specific date and specialization
export const getAvailableDoctors = async (req, res) => {
    const { date, specialization } = req.query;

    try {
        const doctors = await Doctor.find({ specialization });
        const availableDoctors = [];

        for (const doctor of doctors) {
            const appointmentCount = await Appointment.countDocuments({
                doctorId: doctor._id,
                date,
                status: 'upcoming',
            });

            if (appointmentCount < doctor.maxAppointmentsPerDay) {
                availableDoctors.push(doctor);
            }
        }

        res.json(availableDoctors);
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching available doctors', error: error.message });
    }
};

// appointment.controller.js
export const getDoctorAppointments = async (req, res) => {
    const { doctorId } = req.params;

    try {
        const appointments = await Appointment.find({ doctorId }).populate('userId', 'name');
        res.json(appointments);
    } catch (error) {
        console.error('Error fetching doctor appointments:', error); // Log the error
        res.status(500).json({ success: false, message: 'Error fetching appointments', error: error.message });
    }
};



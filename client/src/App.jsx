import { BrowserRouter, Routes, Route} from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';

import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Profile from './pages/Profile';
import Header from './components/Header';

import PrivateRoute from './components/PrivateRoute';

import AdminProfile from './pages/AdminProfile';
import ManageUsers from './pages/ManageUsers';
import ContactUs from './pages/ContactUs';
import DoctorProfile from './pages/Docter/DoctorProfile';
import DoctorForm from './pages/Docter/DoctorForm';
import DoctorList from './pages/Docter/DoctorList';

import AppointmentBooking from './pages/Appointments/AppointmentBooking';
import UserAppointments from './pages/Appointments/UserAppointments';
import DoctorAppointments from './pages/Appointments/DoctorAppointments';
import UpdateAppointment from './pages/Appointments/UpdateAppointment';

import UploadReportForm from './pages/reports/uploadReport';
import SearchPatients from './pages/reports/searchPatients';



export default function App() {
  return <BrowserRouter>
  <Header />
    <Routes>
      <Route path = "/" element = {<Home />} />
      <Route path = "/about" element = {<About />} />
      <Route path = "/contact" element = {<ContactUs />} />
      <Route path = "/sign-in" element = {<SignIn />} />
      <Route path = "/sign-up" element = {<SignUp />} />

      <Route element={<PrivateRoute />}>
        <Route path = "/profile" element = {<Profile />} />
        <Route path="/appointments/book" element={<AppointmentBooking />} />
        <Route path="/appointments/my" element={<UserAppointments />} />
        <Route path="/appointments/update/:id" element={<UpdateAppointment />} /> 
      </Route>

      <Route element={<PrivateRoute adminOnly={true} />}>
        <Route path="/manage-users" element={<ManageUsers />} />
        <Route path='/admin-profile' element={<AdminProfile />} />
        <Route path = "/add-doc" element = {<DoctorForm />} />
        <Route path="/doctor-list" element={<DoctorList />} />
      </Route>

      <Route element={<PrivateRoute doctorOnly={true} />}>
          <Route path="/doctor/appointments" element={<DoctorAppointments />} />
          <Route path="/doctor-profile/:id" element={<DoctorProfile />} />
          <Route path="/upload-report/:patientId" element={<UploadReportForm />} />
      </Route>

      <Route path="/search-patients" element={<SearchPatients />} />

    </Routes>
  
  </BrowserRouter>
    
}

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
import ViewReportsByDoctor from './pages/reports/viewReportsByDoctor';
import UpdateReportForm from './pages/reports/updateReportDoctor';
import ViewReportsByPatient from './pages/reports/viewReportsByPatients';

import ViewMessages from './pages/ViewMessages';

import TreatmentHome from "./pages/Treatment/TreatmentHome";
import Treatment from "./pages/Treatment/TreatmentPage";
import PatientTreatment from "./pages/Treatment/PatientTreatment";

import AddSupportMessage from "./pages/chat/AddSupportMessage";
import SupportMessages from "./pages/chat/SupportMessages";
import UserConversations from "./pages/chat/UserConversations";
import ConversationDetail from "./pages/chat/ConversationDetail";
import MDashboard from "./pages/chat/MDashboard";
import MeDashboard from "./pages/chat/MeDashboard";



export default function App() {
  return <BrowserRouter>
  <Header />
    <Routes>
      <Route path = "/" element = {<Home />} />
      <Route path = "/about" element = {<About />} />
      <Route path = "/contact" element = {<ContactUs />} />
      <Route path = "/sign-in" element = {<SignIn />} />
      <Route path = "/sign-up" element = {<SignUp />} />

      <Route path="/my-conversations" element={<UserConversations />} />
      <Route path="/conversation/:id" element={<ConversationDetail />} />
      <Route path = "/MDashboard" element = {<MDashboard />} />
      <Route path = "/MeDashboard" element = {<MeDashboard />} />
      <Route path = "/adds" element = {<AddSupportMessage />} />

      <Route element={<PrivateRoute />}>
        <Route path = "/profile" element = {<Profile />} />
        <Route path="/appointments/book" element={<AppointmentBooking />} />
        <Route path="/appointments/my" element={<UserAppointments />} />
        <Route path="/appointments/update/:id" element={<UpdateAppointment />} /> 
        <Route path="/patient-treatment" element={<PatientTreatment />} />
        <Route path="/view-reports-patient" element={<ViewReportsByPatient />} />


      </Route>

      <Route element={<PrivateRoute adminOnly={true} />}>
        <Route path="/manage-users" element={<ManageUsers />} />
        <Route path='/admin-profile' element={<AdminProfile />} />
        <Route path = "/add-doc" element = {<DoctorForm />} />
        <Route path="/doctor-list" element={<DoctorList />} />
        <Route path='/messages' element={<ViewMessages />} />
        <Route path="/treatment" element={<TreatmentHome />} />
        <Route path="/treatment-list/:userId" element={<Treatment />} />
        <Route path = "/views" element = {<SupportMessages />} />

      </Route>

      <Route element={<PrivateRoute doctorOnly={true} />}>
          <Route path="/doctor/appointments" element={<DoctorAppointments />} />
          <Route path="/doctor-profile/:id" element={<DoctorProfile />} />
          <Route path="/upload-report/:patientId" element={<UploadReportForm />} />
          <Route path="/search-patients" element={<SearchPatients />} />
          <Route path="/view-reports-doctor" element={<ViewReportsByDoctor />} />
          <Route path="/update-reports-doctor/:reportId" element={<UpdateReportForm />} />
      </Route>


    </Routes>
  
  </BrowserRouter>
    
}

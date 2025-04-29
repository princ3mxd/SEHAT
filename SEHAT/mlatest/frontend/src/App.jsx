import { Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuthStore } from './store/auth.store.js';
import ProtectedRoute from './components/ProtectedRoute';
import RestrictedRoute from './components/RestrictedRoute';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Profile from './pages/Profile';
import Appointment from './pages/AppointmentBooking.jsx';
import Symptom from './pages/Symptom';
import DoctorDashboard from './pages/DoctorDashboard';
import ImageUploader from './components/imageUploader.jsx';
import Maps from './pages/Maps.jsx';
import SafeRoute from './pages/safeRoute.jsx';
import All from './pages/All.jsx';
import Diagnosis from "./pages/Diagnosis.jsx"
import UserAppointments from './pages/UserAppointments';
import HealthForm from './pages/HealthForm';
import PrescriptionUploader from './components/PrescriptionUploader';
import ReportGenerator from './components/ReportGenerator';
import SchemeFinder from './components/SchemeFinder';

function App() {
  const { checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <div className="min-h-screen">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/login" element={
          <RestrictedRoute>
            <Login />
          </RestrictedRoute>
        } />
        <Route path="/signup" element={
          <RestrictedRoute>
            <Signup />
          </RestrictedRoute>
        } />

        <Route path="/profile" element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } />
        <Route path="/appointment" element={
          <ProtectedRoute>
            <Appointment />
          </ProtectedRoute>
        } />
        <Route path="/my-appointments" element={
          <ProtectedRoute>
            <UserAppointments />
          </ProtectedRoute>
        } />
        <Route path="/symptoms" element={
          <ProtectedRoute>
            <Symptom />
          </ProtectedRoute>
        } />
        <Route path="/doctor/dashboard" element={
          <ProtectedRoute>
            <DoctorDashboard />
          </ProtectedRoute>
        } />
        <Route path="/doctor/prescriptions" element={
          <ProtectedRoute>
            <PrescriptionUploader />
          </ProtectedRoute>
        } />
        <Route path="/safety" element={
          <ProtectedRoute>
            <ImageUploader />
          </ProtectedRoute>
        } />
        <Route path="/maps" element={
          <ProtectedRoute>
            <Maps />
          </ProtectedRoute>
        } />
        <Route path="/unsafe" element={
          <ProtectedRoute>
            <Maps />
          </ProtectedRoute>
        } />
        <Route path="/safe" element={
          <ProtectedRoute>
            <SafeRoute />
          </ProtectedRoute>
        } />
        <Route path="/all" element={
          <ProtectedRoute>
            <All />
          </ProtectedRoute>
        } />
        <Route path="/report" element={
          <ProtectedRoute>
            <ReportGenerator />
          </ProtectedRoute>
        } />
        <Route path="/diagnosis" element={
          <ProtectedRoute>
            <Diagnosis />
          </ProtectedRoute>
        } />
        <Route path="/health-form" element={
          <ProtectedRoute>
            <HealthForm />
          </ProtectedRoute>
        } />
        <Route path="/schemes" element={<SchemeFinder />} />
      </Routes>
    </div>
  );
}

export default App;
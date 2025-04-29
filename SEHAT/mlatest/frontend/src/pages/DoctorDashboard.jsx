import React, { useEffect, useState } from 'react';
import useDoctorStore from '../store/doctorStore';
import {
    CalendarIcon,
    CheckCircleIcon,
    XCircleIcon,
    ClockIcon,
    VideoCameraIcon,
    DocumentTextIcon,
    DocumentIcon
} from '@heroicons/react/24/outline';
import PrescriptionUploader from '../components/PrescriptionUploader';

const DoctorDashboard = () => {
    const { fetchAllAppointments, appointments, loading, error, updateAppointmentStatus, uploadPrescription } = useDoctorStore();
    const [statusFilter, setStatusFilter] = useState('all');
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);
    const [prescriptionFile, setPrescriptionFile] = useState(null);
    const [activeTab, setActiveTab] = useState('appointments');
    const BACKEND_URL = 'http://localhost:5000';

    useEffect(() => {
        fetchAllAppointments();
    }, [fetchAllAppointments]);

    const handleStatusUpdate = async (appointmentId, newStatus) => {
        try {
            await updateAppointmentStatus(appointmentId, newStatus);
            fetchAllAppointments();
        } catch (err) {
            console.error('Error updating appointment:', err);
        }
    };

    const handleCreateMeet = () => {
        try {
            window.open('https://web-production-f3b3.up.railway.app/', '_blank');
        } catch (err) {
            console.error('Error creating meet:', err);
        }
    };

    const handlePrescriptionUpload = async (e) => {
        e.preventDefault();
        if (!prescriptionFile || !selectedAppointment) return;

        const formData = new FormData();
        formData.append('prescription', prescriptionFile);
        formData.append('patientEmail', selectedAppointment.user.email);

        try {
            await uploadPrescription(selectedAppointment._id, formData);
            setShowPrescriptionModal(false);
            setPrescriptionFile(null);
            setSelectedAppointment(null);
            fetchAllAppointments();
        } catch (err) {
            console.error('Error uploading prescription:', err);
        }
    };

    const filteredAppointments = statusFilter === 'all'
        ? appointments
        : appointments.filter(apt => apt.status === statusFilter);

    const totalAppointments = appointments.length;
    const completedAppointments = appointments.filter(apt => apt.status === 'completed').length;
    const pendingAppointments = appointments.filter(apt => apt.status === 'pending').length;
    const cancelledAppointments = appointments.filter(apt => apt.status === 'cancelled').length;

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="bg-red-50 p-6 rounded-lg shadow-sm">
                    <h3 className="text-red-800 font-medium">Error Loading Dashboard</h3>
                    <p className="text-red-600 mt-2">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Doctor Dashboard</h1>
                <p className="text-gray-600 mt-2">Manage your appointments and patient records</p>
            </div>

            <div className="mb-6 border-b border-gray-200">
                <ul className="flex flex-wrap -mb-px text-sm font-medium text-center">
                    <li className="mr-2">
                        <button
                            onClick={() => setActiveTab('appointments')}
                            className={`inline-block p-4 rounded-t-lg ${activeTab === 'appointments'
                                ? 'text-blue-600 border-b-2 border-blue-600'
                                : 'text-gray-500 hover:text-gray-600 hover:border-gray-300'
                                }`}
                        >
                            Appointments
                        </button>
                    </li>
                    <li className="mr-2">
                        <button
                            onClick={() => setActiveTab('prescriptions')}
                            className={`inline-block p-4 rounded-t-lg ${activeTab === 'prescriptions'
                                ? 'text-blue-600 border-b-2 border-blue-600'
                                : 'text-gray-500 hover:text-gray-600 hover:border-gray-300'
                                }`}
                        >
                            Prescriptions
                        </button>
                    </li>
                </ul>
            </div>

            {activeTab === 'appointments' && (
                <div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                            <div className="flex items-center">
                                <CalendarIcon className="h-8 w-8 text-blue-500" />
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-500">Total Appointments</p>
                                    <p className="text-2xl font-bold text-gray-900">{totalAppointments}</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                            <div className="flex items-center">
                                <ClockIcon className="h-8 w-8 text-yellow-500" />
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-500">Pending</p>
                                    <p className="text-2xl font-bold text-gray-900">{pendingAppointments}</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                            <div className="flex items-center">
                                <CheckCircleIcon className="h-8 w-8 text-green-500" />
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-500">Completed</p>
                                    <p className="text-2xl font-bold text-gray-900">{completedAppointments}</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                            <div className="flex items-center">
                                <XCircleIcon className="h-8 w-8 text-red-500" />
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-500">Cancelled</p>
                                    <p className="text-2xl font-bold text-gray-900">{cancelledAppointments}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
                        <div className="flex flex-wrap gap-3">
                            <button
                                className={`px-6 py-2 rounded-full transition-all ${statusFilter === 'all'
                                    ? 'bg-green-500 text-white shadow-md'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                                onClick={() => setStatusFilter('all')}
                            >
                                All Appointments
                            </button>
                            <button
                                className={`px-6 py-2 rounded-full transition-all ${statusFilter === 'pending'
                                    ? 'bg-yellow-500 text-white shadow-md'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                                onClick={() => setStatusFilter('pending')}
                            >
                                Pending
                            </button>
                            <button
                                className={`px-6 py-2 rounded-full transition-all ${statusFilter === 'completed'
                                    ? 'bg-green-500 text-white shadow-md'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                                onClick={() => setStatusFilter('completed')}
                            >
                                Completed
                            </button>
                            <button
                                className={`px-6 py-2 rounded-full transition-all ${statusFilter === 'cancelled'
                                    ? 'bg-red-500 text-white shadow-md'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                                onClick={() => setStatusFilter('cancelled')}
                            >
                                Cancelled
                            </button>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Patient</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Doctor</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date & Time</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Health Card</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 bg-white">
                                    {filteredAppointments.length === 0 ? (
                                        <tr>
                                            <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                                                <div className="flex flex-col items-center">
                                                    <CalendarIcon className="h-12 w-12 text-gray-400 mb-2" />
                                                    <p className="text-gray-600 font-medium">No appointments found</p>
                                                    <p className="text-gray-400 text-sm">Try changing the filter or check back later</p>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredAppointments.map((appointment) => (
                                            <tr key={appointment._id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                                                            <span className="text-xl text-gray-600">
                                                                {appointment.user?.name?.charAt(0) || "G"}
                                                            </span>
                                                        </div>
                                                        <div className="ml-4">
                                                            <div className="text-sm font-medium text-gray-900">
                                                                {appointment.user?.name || "Guest Patient"}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900">Dr. {appointment.doctor?.name || "Unknown"}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900">
                                                        {new Date(appointment.appointmentDate).toLocaleDateString()}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        {new Date(appointment.appointmentDate).toLocaleTimeString()}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${appointment.status === 'completed' ? 'bg-green-100 text-green-800' :
                                                        appointment.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                                            'bg-blue-100 text-blue-800'
                                                        }`}>
                                                        {appointment.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {appointment.healthCardDocument ? (
                                                        <button
                                                            onClick={() => {
                                                                const url = appointment.healthCardDocument.url;
                                                                // Check if URL is relative (doesn't start with http)
                                                                if (url && !url.startsWith('http')) {
                                                                    // Add backend URL if it's a relative path
                                                                    window.open(`${BACKEND_URL}${url}`, '_blank');
                                                                } else {
                                                                    window.open(url, '_blank');
                                                                }
                                                            }}
                                                            className="flex items-center text-blue-600 hover:text-blue-700"
                                                        >
                                                            <DocumentIcon className="h-5 w-5 mr-1" />
                                                            <span>View Health Card</span>
                                                        </button>
                                                    ) : (
                                                        <span className="text-gray-500 text-sm">No document</span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {appointment.status === 'scheduled' && (
                                                        <div className="flex space-x-2">
                                                            <button
                                                                onClick={() => handleCreateMeet()}
                                                                className="px-4 py-2 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition-colors flex items-center"
                                                            >
                                                                <VideoCameraIcon className="h-4 w-4 mr-1" />
                                                                Start Meet
                                                            </button>
                                                            <button
                                                                onClick={() => handleStatusUpdate(appointment._id, 'completed')}
                                                                className="px-4 py-2 bg-green-500 text-white text-sm rounded-lg hover:bg-green-600 transition-colors flex items-center"
                                                            >
                                                                <CheckCircleIcon className="h-4 w-4 mr-1" />
                                                                Complete
                                                            </button>
                                                            <button
                                                                onClick={() => handleStatusUpdate(appointment._id, 'cancelled')}
                                                                className="px-4 py-2 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 transition-colors flex items-center"
                                                            >
                                                                <XCircleIcon className="h-4 w-4 mr-1" />
                                                                Cancel
                                                            </button>
                                                        </div>
                                                    )}
                                                    {appointment.status === 'completed' && (
                                                        <div className="flex space-x-2">
                                                            <button
                                                                onClick={() => {
                                                                    setSelectedAppointment(appointment);
                                                                    setShowPrescriptionModal(true);
                                                                }}
                                                                className="px-4 py-2 bg-purple-500 text-white text-sm rounded-lg hover:bg-purple-600 transition-colors flex items-center"
                                                            >
                                                                <DocumentTextIcon className="h-4 w-4 mr-1" />
                                                                Upload Prescription
                                                            </button>
                                                        </div>
                                                    )}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'prescriptions' && (
                <div className="bg-white rounded-lg shadow">
                    <PrescriptionUploader />
                </div>
            )}
            {showPrescriptionModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full">
                        <h3 className="text-lg font-medium mb-4">Upload Prescription</h3>
                        <form onSubmit={handlePrescriptionUpload}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Select Prescription File
                                </label>
                                <input
                                    type="file"
                                    accept=".pdf,.doc,.docx"
                                    onChange={(e) => setPrescriptionFile(e.target.files[0])}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                    required
                                />
                            </div>
                            <div className="flex justify-end space-x-3">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowPrescriptionModal(false);
                                        setPrescriptionFile(null);
                                        setSelectedAppointment(null);
                                    }}
                                    className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                                >
                                    Upload
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DoctorDashboard;
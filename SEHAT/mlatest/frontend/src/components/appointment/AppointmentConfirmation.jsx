import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAppointmentStore from '../../store/appointmentStore';
import { useAuthStore } from '../../store/auth.store';
import { BuildingOffice2Icon, UserIcon, CalendarIcon, ClockIcon, CheckCircleIcon, XMarkIcon, DocumentIcon } from '@heroicons/react/24/outline';

const AppointmentConfirmation = () => {
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    const [healthCardFile, setHealthCardFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const { user } = useAuthStore();
    const {
        selectedHospital,
        selectedDoctor,
        selectedDate,
        createAppointment,
        resetSelections,
        loading
    } = useAppointmentStore();

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 10 * 1024 * 1024) {
                setError('File size should be less than 10MB');
                return;
            }
            if (!['application/pdf', 'image/jpeg', 'image/png'].includes(file.type)) {
                setError('Only PDF, JPEG, and PNG files are allowed');
                return;
            }
            setHealthCardFile(file);
            setError(null);
        }
    };

    const handleConfirm = async () => {
        try {
            setUploading(true);
            setError(null);

            // Validate required fields
            if (!selectedDoctor?._id) {
                setError('Doctor selection is required');
                return;
            }
            if (!selectedDate) {
                setError('Appointment date is required');
                return;
            }

            const userId = user?._id || "645a3293a95d3aa3e37898b4";
            const formData = new FormData();

            // Format date to ISO string
            const formattedDate = new Date(selectedDate).toISOString();

            formData.append('user', userId);
            formData.append('doctor', selectedDoctor._id);
            formData.append('appointmentDate', formattedDate);
            formData.append('status', 'scheduled');

            if (healthCardFile) {
                formData.append('healthCardDocument', healthCardFile);
            }

            await createAppointment(formData);
            resetSelections();
            navigate('/profile');
        } catch (error) {
            console.error('Appointment creation error:', error);
            const errorMessage = error.response?.data?.message || 'Failed to create appointment';
            setError(errorMessage);
        } finally {
            setUploading(false);
        }
    };

    const handleCancel = () => {
        resetSelections();
    };

    if (loading || uploading) {
        return (
            <div className="min-h-[400px] flex items-center justify-center">
                <div className="flex flex-col items-center space-y-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
                    <p className="text-gray-600 font-medium">
                        {uploading ? 'Uploading health card...' : 'Creating your appointment...'}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="text-center mb-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircleIcon className="h-8 w-8 text-green-600" />
                </div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">Confirm Your Appointment</h2>
                <p className="text-gray-600">Please review your appointment details before confirming</p>
            </div>
            {error && (
                <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
                    <div className="flex items-center">
                        <XMarkIcon className="h-5 w-5 text-red-500 mr-2" />
                        <p className="text-red-700">{error}</p>
                    </div>
                </div>
            )}

            <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-6">
                <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                        <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                            <BuildingOffice2Icon className="h-6 w-6 text-green-600" />
                        </div>
                    </div>
                    <div className="flex-1">
                        <h3 className="text-lg font-medium text-gray-900 mb-1">Hospital</h3>
                        <p className="text-gray-600">{selectedHospital.name}</p>
                        <p className="text-sm text-gray-500 mt-1">{selectedHospital.address}</p>
                    </div>
                </div>

                <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                        <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                            <UserIcon className="h-6 w-6 text-green-600" />
                        </div>
                    </div>
                    <div className="flex-1">
                        <h3 className="text-lg font-medium text-gray-900 mb-1">Doctor</h3>
                        <p className="text-gray-600">Dr. {selectedDoctor.name}</p>
                        <p className="text-sm text-gray-500 mt-1">{selectedDoctor.specialization}</p>
                    </div>
                </div>

                <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                        <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                            <CalendarIcon className="h-6 w-6 text-green-600" />
                        </div>
                    </div>
                    <div className="flex-1">
                        <h3 className="text-lg font-medium text-gray-900 mb-1">Date</h3>
                        <p className="text-gray-600">
                            {selectedDate.toLocaleDateString('en-US', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}
                        </p>
                    </div>
                </div>

                <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                        <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                            <ClockIcon className="h-6 w-6 text-green-600" />
                        </div>
                    </div>
                    <div className="flex-1">
                        <h3 className="text-lg font-medium text-gray-900 mb-1">Time</h3>
                        <p className="text-gray-600">
                            {selectedDate.toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit'
                            })}
                        </p>
                    </div>
                </div>

                <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                        <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                            <DocumentIcon className="h-6 w-6 text-green-600" />
                        </div>
                    </div>
                    <div className="flex-1">
                        <h3 className="text-lg font-medium text-gray-900 mb-1">Health Card Document</h3>
                        <div className="mt-2">
                            <label className="block">
                                <span className="sr-only">Choose health card document</span>
                                <input
                                    type="file"
                                    accept=".pdf,.jpg,.jpeg,.png"
                                    onChange={handleFileChange}
                                    className="block w-full text-sm text-gray-500
                                        file:mr-4 file:py-2 file:px-4
                                        file:rounded-full file:border-0
                                        file:text-sm file:font-semibold
                                        file:bg-green-50 file:text-green-700
                                        hover:file:bg-green-100"
                                />
                            </label>
                            {healthCardFile && (
                                <p className="mt-2 text-sm text-gray-500">
                                    Selected file: {healthCardFile.name}
                                </p>
                            )}
                            <p className="mt-1 text-sm text-gray-500">
                                Upload your health card document (PDF, JPG, or PNG, max 10MB)
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex justify-center space-x-4">
                <button
                    onClick={handleCancel}
                    className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                    Cancel
                </button>
                <button
                    onClick={handleConfirm}
                    disabled={uploading}
                    className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {uploading ? 'Confirming...' : 'Confirm Appointment'}
                </button>
            </div>
        </div>
    );
};

export default AppointmentConfirmation;
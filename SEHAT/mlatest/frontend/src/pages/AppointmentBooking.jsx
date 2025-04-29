import React, { useEffect } from 'react';
import useAppointmentStore from '../store/appointmentStore';
import HospitalSelection from '../components/appointment/HospitalSelection';
import DoctorSelection from '../components/appointment/DoctorSelection';
import TimeSlotSelection from '../components/appointment/TimeSlotSelection';
import AppointmentConfirmation from '../components/appointment/AppointmentConfirmation';
import { BuildingOffice2Icon, UserIcon, CalendarIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

const AppointmentBooking = () => {
    const {
        fetchHospitals,
        selectedHospital,
        selectedDoctor,
        selectedDate,
        loading,
        error
    } = useAppointmentStore();

    useEffect(() => {
        fetchHospitals();
    }, [fetchHospitals]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="flex flex-col items-center space-y-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
                    <p className="text-gray-600 font-medium">Loading appointment options...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="bg-red-50 p-6 rounded-lg max-w-md text-center">
                    <p className="text-red-600 font-medium">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">Book Your Appointment</h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Schedule your consultation with our expert doctors. Choose your preferred hospital, doctor, and time slot.
                    </p>
                </div>

                <div className="max-w-3xl mx-auto mb-12">
                    <div className="flex items-center justify-between">
                        <div className="flex flex-col items-center">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                                selectedHospital ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-600'
                            }`}>
                                <BuildingOffice2Icon className="h-6 w-6" />
                            </div>
                            <span className="mt-2 text-sm font-medium text-gray-700">Hospital</span>
                        </div>
                        <div className={`flex-1 h-1 ${selectedHospital ? 'bg-green-500' : 'bg-gray-200'}`}></div>
                        <div className="flex flex-col items-center">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                                selectedDoctor ? 'bg-green-500 text-white' : selectedHospital ? 'bg-gray-200 text-gray-600' : 'bg-gray-100 text-gray-400'
                            }`}>
                                <UserIcon className="h-6 w-6" />
                            </div>
                            <span className="mt-2 text-sm font-medium text-gray-700">Doctor</span>
                        </div>
                        <div className={`flex-1 h-1 ${selectedDoctor ? 'bg-green-500' : 'bg-gray-200'}`}></div>
                        <div className="flex flex-col items-center">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                                selectedDate ? 'bg-green-500 text-white' : selectedDoctor ? 'bg-gray-200 text-gray-600' : 'bg-gray-100 text-gray-400'
                            }`}>
                                <CalendarIcon className="h-6 w-6" />
                            </div>
                            <span className="mt-2 text-sm font-medium text-gray-700">Time</span>
                        </div>
                        <div className={`flex-1 h-1 ${selectedDate ? 'bg-green-500' : 'bg-gray-200'}`}></div>
                        <div className="flex flex-col items-center">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                                selectedDate ? 'bg-gray-200 text-gray-600' : 'bg-gray-100 text-gray-400'
                            }`}>
                                <CheckCircleIcon className="h-6 w-6" />
                            </div>
                            <span className="mt-2 text-sm font-medium text-gray-700">Confirm</span>
                        </div>
                    </div>
                </div>

                <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
                    <div className="p-8">
                        {!selectedHospital && <HospitalSelection />}
                        {selectedHospital && !selectedDoctor && <DoctorSelection />}
                        {selectedDoctor && !selectedDate && <TimeSlotSelection />}
                        {selectedDate && <AppointmentConfirmation />}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AppointmentBooking;
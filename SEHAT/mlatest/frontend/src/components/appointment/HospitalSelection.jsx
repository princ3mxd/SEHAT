import React, { useState, useEffect } from 'react';
import useAppointmentStore from '../../store/appointmentStore';
import { BuildingOffice2Icon, MapPinIcon, PhoneIcon, ClockIcon } from '@heroicons/react/24/outline';

const HospitalSelection = () => {
    const { hospitals, setSelectedHospital, loading } = useAppointmentStore();
    const [searchTerm, setSearchTerm] = useState('');

    const filteredHospitals = hospitals.filter(hospital =>
        hospital.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        hospital.address.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="text-center mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">Select a Hospital</h2>
                <p className="text-gray-600">Choose from our network of trusted healthcare facilities</p>
            </div>

            {/* Search Bar */}
            <div className="relative">
                <input
                    type="text"
                    placeholder="Search hospitals by name or location..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
            </div>

            {/* Hospital Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredHospitals.map((hospital) => (
                    <div
                        key={hospital._id}
                        onClick={() => setSelectedHospital(hospital)}
                        className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow duration-300 cursor-pointer group"
                    >
                        <div className="flex items-start space-x-4">
                            <div className="flex-shrink-0">
                                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center group-hover:bg-green-500 transition-colors duration-300">
                                    <BuildingOffice2Icon className="h-6 w-6 text-green-600 group-hover:text-white transition-colors duration-300" />
                                </div>
                            </div>
                            <div className="flex-1">
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">{hospital.name}</h3>
                                <div className="space-y-2">
                                    <div className="flex items-center text-gray-600">
                                        <MapPinIcon className="h-5 w-5 mr-2 text-gray-400" />
                                        <span>{hospital.address}</span>
                                    </div>
                                    <div className="flex items-center text-gray-600">
                                        <PhoneIcon className="h-5 w-5 mr-2 text-gray-400" />
                                        <span>{hospital.contactNumber}</span>
                                    </div>
                                    <div className="flex items-center text-gray-600">
                                        <ClockIcon className="h-5 w-5 mr-2 text-gray-400" />
                                        <span>{hospital.workingHours || '24/7'}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {filteredHospitals.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-gray-500">No hospitals found matching your search.</p>
                </div>
            )}
        </div>
    );
};

export default HospitalSelection;
import React, { useState, useEffect } from 'react';
import useAppointmentStore from '../../store/appointmentStore';
import { UserIcon, AcademicCapIcon, ClockIcon, StarIcon } from '@heroicons/react/24/outline';

const DoctorSelection = () => {
    const { doctors, selectedHospital, setSelectedDoctor, loading } = useAppointmentStore();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedSpecialty, setSelectedSpecialty] = useState('all');

    const specialties = ['all', ...new Set(doctors.map(doctor => doctor.specialization))];

    const filteredDoctors = doctors.filter(doctor =>
        (doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (selectedSpecialty === 'all' || doctor.specialization === selectedSpecialty)
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
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">Select Your Doctor</h2>
                <p className="text-gray-600">Choose from our specialists at {selectedHospital.name}</p>
            </div>

            {/* Search and Filter Section */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <input
                        type="text"
                        placeholder="Search doctors by name or specialty..."
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
                <select
                    value={selectedSpecialty}
                    onChange={(e) => setSelectedSpecialty(e.target.value)}
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white"
                >
                    {specialties.map(specialty => (
                        <option key={specialty} value={specialty}>
                            {specialty === 'all' ? 'All Specialties' : specialty}
                        </option>
                    ))}
                </select>
            </div>

            {/* Doctor Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredDoctors.map((doctor) => (
                    <div
                        key={doctor._id}
                        onClick={() => setSelectedDoctor(doctor)}
                        className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300 cursor-pointer group"
                    >
                        <div className="flex items-start space-x-4">
                            <div className="flex-shrink-0">
                                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center group-hover:bg-green-500 transition-colors duration-300">
                                    {doctor.image ? (
                                        <img
                                            src={doctor.image}
                                            alt={doctor.name}
                                            className="w-16 h-16 rounded-full object-cover"
                                        />
                                    ) : (
                                        <UserIcon className="h-8 w-8 text-green-600 group-hover:text-white transition-colors duration-300" />
                                    )}
                                </div>
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-semibold text-gray-900">Dr. {doctor.name}</h3>
                                    <div className="flex items-center text-yellow-500">
                                        <StarIcon className="h-5 w-5" />
                                        <span className="ml-1 text-sm font-medium">{doctor.rating || '4.8'}</span>
                                    </div>
                                </div>
                                <div className="flex items-center text-green-600 font-medium mb-2">
                                    <AcademicCapIcon className="h-5 w-5 mr-2" />
                                    <span>{doctor.specialization}</span>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex items-center text-gray-600">
                                        <ClockIcon className="h-5 w-5 mr-2 text-gray-400" />
                                        <span>{doctor.availability || 'Available Today'}</span>
                                    </div>
                                    <p className="text-sm text-gray-500 mt-2 line-clamp-2">
                                        {doctor.bio || 'Experienced healthcare professional with a focus on patient care and well-being.'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {filteredDoctors.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-gray-500">No doctors found matching your search criteria.</p>
                </div>
            )}
        </div>
    );
};

export default DoctorSelection;
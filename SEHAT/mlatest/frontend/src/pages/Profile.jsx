import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../store/auth.store';
import useAppointmentStore from '../store/appointmentStore';
import { CalendarIcon, CheckCircleIcon, XCircleIcon, ClockIcon, VideoCameraIcon } from '@heroicons/react/24/outline';

const Profile = () => {
  const { user } = useAuthStore();
  const { appointments, fetchUserAppointments, cancelAppointment, loading: appointmentsLoading } = useAppointmentStore();
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    if (user?._id) {
      fetchUserAppointments(user._id);
    }
  }, [user?._id, fetchUserAppointments]);

  const handleCancelAppointment = async (appointmentId) => {
    try {
      await cancelAppointment(appointmentId);
      if (user?._id) {
        fetchUserAppointments(user._id);
      }
    } catch (error) {
      console.error('Failed to cancel appointment:', error);
    }
  };

  const handleJoinMeet = (meetLink) => {
    if (meetLink) {
      window.open(meetLink, '_blank');
    }
  };

  const totalAppointments = appointments.length;
  const activeAppointments = appointments.filter(apt => apt.status === 'scheduled').length;
  const completedAppointments = appointments.filter(apt => apt.status === 'completed').length;
  const cancelledAppointments = appointments.filter(apt => apt.status === 'cancelled').length;

  const filteredAppointments = statusFilter === 'all'
    ? appointments
    : appointments.filter(apt => apt.status === statusFilter);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
            <div className="bg-gradient-to-r from-green-500 to-green-600 h-32"></div>
            <div className="px-8 py-6 relative">
              <div className="absolute -top-16 left-8">
                <div className="h-32 w-32 rounded-full bg-white p-1 shadow-lg">
                  <div className="h-full w-full rounded-full bg-green-100 flex items-center justify-center">
                    <span className="text-4xl font-bold text-green-600">
                      {user?.name?.[0]?.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>
              <div className="ml-40">
                <h1 className="text-3xl font-bold text-gray-900">{user?.name}</h1>
                <p className="text-gray-600">{user?.email}</p>
                <p className="text-sm text-gray-500 capitalize mt-1">
                  Role: {user?.role}
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-800">Personal Information</h2>
                </div>

                <div className="p-6">
                  <dl className="space-y-6">
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Full Name</dt>
                      <dd className="mt-1 text-lg text-gray-900">{user?.name || 'Not provided'}</dd>
                    </div>

                    <div>
                      <dt className="text-sm font-medium text-gray-500">Email Address</dt>
                      <dd className="mt-1 text-lg text-gray-900">{user?.email || 'Not provided'}</dd>
                    </div>
                  </dl>
                </div>
              </div>
            </div>

            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-800">My Appointments</h2>
                </div>

                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-blue-50 rounded-lg p-4">
                      <div className="flex items-center">
                        <CalendarIcon className="h-6 w-6 text-blue-500 mr-2" />
                        <div>
                          <p className="text-sm text-gray-500">Total</p>
                          <p className="text-2xl font-bold text-gray-900">{totalAppointments}</p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-yellow-50 rounded-lg p-4">
                      <div className="flex items-center">
                        <ClockIcon className="h-6 w-6 text-yellow-500 mr-2" />
                        <div>
                          <p className="text-sm text-gray-500">Active</p>
                          <p className="text-2xl font-bold text-gray-900">{activeAppointments}</p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-green-50 rounded-lg p-4">
                      <div className="flex items-center">
                        <CheckCircleIcon className="h-6 w-6 text-green-500 mr-2" />
                        <div>
                          <p className="text-sm text-gray-500">Completed</p>
                          <p className="text-2xl font-bold text-gray-900">{completedAppointments}</p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-red-50 rounded-lg p-4">
                      <div className="flex items-center">
                        <XCircleIcon className="h-6 w-6 text-red-500 mr-2" />
                        <div>
                          <p className="text-sm text-gray-500">Cancelled</p>
                          <p className="text-2xl font-bold text-gray-900">{cancelledAppointments}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2 mb-6">
                    <button
                      onClick={() => setStatusFilter('all')}
                      className={`px-4 py-2 rounded-lg text-sm font-medium ${statusFilter === 'all'
                          ? 'bg-green-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                    >
                      All
                    </button>
                    <button
                      onClick={() => setStatusFilter('scheduled')}
                      className={`px-4 py-2 rounded-lg text-sm font-medium ${statusFilter === 'scheduled'
                          ? 'bg-green-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                    >
                      Scheduled
                    </button>
                    <button
                      onClick={() => setStatusFilter('completed')}
                      className={`px-4 py-2 rounded-lg text-sm font-medium ${statusFilter === 'completed'
                          ? 'bg-green-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                    >
                      Completed
                    </button>
                    <button
                      onClick={() => setStatusFilter('cancelled')}
                      className={`px-4 py-2 rounded-lg text-sm font-medium ${statusFilter === 'cancelled'
                          ? 'bg-green-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                    >
                      Cancelled
                    </button>
                  </div>
                  {appointmentsLoading ? (
                    <div className="flex justify-center items-center h-32">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
                    </div>
                  ) : filteredAppointments.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <p>No appointments found</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {filteredAppointments.map((appointment) => (
                        <div
                          key={appointment._id}
                          className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900">
                                Dr. {appointment.doctor?.name}
                              </h3>
                              <p className="text-sm text-gray-500">
                                {appointment.doctor?.specialization}
                              </p>
                              <p className="text-sm text-gray-500 mt-1">
                                {new Date(appointment.appointmentDate).toLocaleString()}
                              </p>
                            </div>
                            <div className="flex items-center space-x-2">
                              {appointment.status === 'scheduled' && (
                                <>
                                  {appointment.meetLink && (
                                    <button
                                      onClick={() => handleJoinMeet(appointment.meetLink)}
                                      className="flex items-center px-3 py-1 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200"
                                    >
                                      <VideoCameraIcon className="h-4 w-4 mr-1" />
                                      Join
                                    </button>
                                  )}
                                  <button
                                    onClick={() => handleCancelAppointment(appointment._id)}
                                    className="flex items-center px-3 py-1 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
                                  >
                                    <XCircleIcon className="h-4 w-4 mr-1" />
                                    Cancel
                                  </button>
                                </>
                              )}
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-medium ${appointment.status === 'scheduled'
                                    ? 'bg-yellow-100 text-yellow-800'
                                    : appointment.status === 'completed'
                                      ? 'bg-green-100 text-green-800'
                                      : 'bg-red-100 text-red-800'
                                  }`}
                              >
                                {appointment.status}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
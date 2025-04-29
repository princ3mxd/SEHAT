import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAppointmentStore from '../store/appointmentStore';
import { useAuthStore } from '../store/auth.store';
import {
  CalendarIcon,
  CheckCircleIcon,
  XCircleIcon,
  PlusCircleIcon,
  ClockIcon,
  VideoCameraIcon
} from '@heroicons/react/24/outline';

const MyAppointments = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { appointments, fetchUserAppointments, fetchAllAppointments, cancelAppointment, loading } = useAppointmentStore();
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    if (user?._id) {
      fetchUserAppointments(user._id);
    } else {
      fetchAllAppointments();
    }
  }, [user, fetchUserAppointments, fetchAllAppointments]);

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

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Appointments</h1>
          <button
            onClick={() => navigate('/appointment')}
            className="flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            <PlusCircleIcon className="h-5 w-5 mr-2" />
            Book New Appointment
          </button>
        </div>

        {/* Statistics Cards */}
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
                <p className="text-sm font-medium text-gray-500">Active</p>
                <p className="text-2xl font-bold text-gray-900">{activeAppointments}</p>
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

        {/* Filter Buttons */}
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
              className={`px-6 py-2 rounded-full transition-all ${statusFilter === 'scheduled'
                ? 'bg-green-500 text-white shadow-md'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              onClick={() => setStatusFilter('scheduled')}
            >
              Active
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
                ? 'bg-green-500 text-white shadow-md'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              onClick={() => setStatusFilter('cancelled')}
            >
              Cancelled
            </button>
          </div>
        </div>

        {/* Appointments Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Doctor</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Hospital</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date & Time</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {filteredAppointments.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                      <div className="flex flex-col items-center">
                        <CalendarIcon className="h-12 w-12 text-gray-400 mb-2" />
                        <p className="text-gray-600 font-medium">No appointments found</p>
                        <p className="text-gray-400 text-sm">Try changing the filter or book a new appointment</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredAppointments.map((appointment) => (
                    <tr key={appointment._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                            <span className="text-xl text-green-600">
                              {appointment.doctor?.name?.charAt(0) || "D"}
                            </span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              Dr. {appointment.doctor?.name || "Unknown"}
                            </div>
                            <div className="text-sm text-gray-500">
                              {appointment.doctor?.specialization}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{appointment.doctor?.hospital?.name || "Unknown Hospital"}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {new Date(appointment.appointmentDate).toLocaleDateString()}
                        </div>
                        <div className="text-sm text-gray-500">
                          {new Date(appointment.appointmentDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
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
                        {appointment.status === 'scheduled' && (
                          <div className="flex space-x-2">
                            {appointment.meetLink && (
                              <button
                                onClick={() => handleJoinMeet(appointment.meetLink)}
                                className="px-4 py-2 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition-colors flex items-center"
                              >
                                <VideoCameraIcon className="h-4 w-4 mr-1" />
                                Join Meet
                              </button>
                            )}
                            <button
                              onClick={() => handleCancelAppointment(appointment._id)}
                              className="px-4 py-2 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 transition-colors flex items-center"
                            >
                              <XCircleIcon className="h-4 w-4 mr-1" />
                              Cancel
                            </button>
                          </div>
                        )}
                        {appointment.status === 'completed' && (
                          <span className="text-green-600 flex items-center">
                            <CheckCircleIcon className="h-5 w-5 mr-1" />
                            Completed
                          </span>
                        )}
                        {appointment.status === 'cancelled' && (
                          <span className="text-red-600 flex items-center">
                            <XCircleIcon className="h-5 w-5 mr-1" />
                            Cancelled
                          </span>
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
    </div>
  );
};

export default MyAppointments;
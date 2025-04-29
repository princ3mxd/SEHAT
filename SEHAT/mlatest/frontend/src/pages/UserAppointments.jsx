import React, { useEffect } from 'react';
import { useAuthStore } from '../store/auth.store';
import useAppointmentStore from '../store/appointmentStore';
import UserAppointmentCard from '../components/appointment/UserAppointmentCard';

const UserAppointments = () => {
  const { user } = useAuthStore();
  const { appointments, fetchUserAppointments, loading } = useAppointmentStore();

  useEffect(() => {
    if (user?._id) {
      fetchUserAppointments(user._id);
    }
  }, [user?._id, fetchUserAppointments]);

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
          <p className="text-gray-600 font-medium">Loading appointments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">My Appointments</h1>

      {appointments.length === 0 ? (
        <div className="text-center text-gray-500">
          <p>You don't have any appointments yet.</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {appointments.map((appointment) => (
            <UserAppointmentCard key={appointment._id} appointment={appointment} />
          ))}
        </div>
      )}
    </div>
  );
};

export default UserAppointments; 
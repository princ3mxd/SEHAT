import React, { useState } from 'react';
import { VideoCameraIcon } from '@heroicons/react/24/outline';

const UserAppointmentCard = ({ appointment }) => {
  const [isMeetingActive, setIsMeetingActive] = useState(false);

  const handleJoinMeet = () => {
    window.open('https://web-production-f3b3.up.railway.app/', '_blank');
    setIsMeetingActive(true);
  };

  const handleEndMeet = () => {
    setIsMeetingActive(false);
  };

  return (
    <div>
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="mb-4">
          <h3 className="text-lg font-semibold">Dr. {appointment.doctor.name}</h3>
          <p className="text-gray-600">{appointment.doctor.specialization}</p>
        </div>

        <div className="mb-4">
          <p className="text-sm text-gray-500">Appointment Time</p>
          <p className="font-medium">
            {new Date(appointment.appointmentDate).toLocaleString()}
          </p>
        </div>

        <div className="mb-4">
          <p className="text-sm text-gray-500">Status</p>
          <span
            className={`inline-block px-2 py-1 rounded-full text-sm ${appointment.status === 'completed'
              ? 'bg-green-100 text-green-800'
              : appointment.status === 'cancelled'
                ? 'bg-red-100 text-red-800'
                : 'bg-blue-100 text-blue-800'
              }`}
          >
            {appointment.status}
          </span>
        </div>

        {appointment.status === 'scheduled' && appointment.meetLink && (
          <div className="flex gap-2">
            <button
              onClick={handleJoinMeet}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              <VideoCameraIcon className="h-5 w-5" />
              Join Meet
            </button>
            {isMeetingActive && (
              <button
                onClick={handleEndMeet}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                End Meet
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserAppointmentCard; 
// frontend/src/components/doctor/AppointmentCard.jsx
import React, { useState } from 'react';
import useDoctorStore from '../../store/doctorStore';
import PrescriptionUploadModal from './PrescriptionUploadModal';
import { DocumentIcon } from '@heroicons/react/24/outline';

const AppointmentCard = ({ appointment }) => {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const { updateAppointmentStatus } = useDoctorStore();

  const handleStatusUpdate = async (status) => {
    try {
      await updateAppointmentStatus(appointment._id, status);
      if (status === 'completed') {
        setShowUploadModal(true);
      }
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  const handleViewHealthCard = () => {
    if (appointment.healthCardDocument?.url) {
      window.open(appointment.healthCardDocument.url, '_blank');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold">{appointment.user.name}</h3>
        <p className="text-gray-600">{appointment.user.email}</p>
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
          className={`inline-block px-2 py-1 rounded-full text-sm ${
            appointment.status === 'completed'
              ? 'bg-green-100 text-green-800'
              : appointment.status === 'cancelled'
              ? 'bg-red-100 text-red-800'
              : 'bg-blue-100 text-blue-800'
          }`}
        >
          {appointment.status}
        </span>
      </div>

      {appointment.healthCardDocument && (
        <div className="mb-4">
          <p className="text-sm text-gray-500 mb-2">Health Card Document</p>
          <button
            onClick={handleViewHealthCard}
            className="flex items-center text-blue-600 hover:text-blue-700"
          >
            <DocumentIcon className="h-5 w-5 mr-1" />
            <span>View Health Card</span>
          </button>
          <p className="text-xs text-gray-500 mt-1">
            Uploaded on {new Date(appointment.healthCardDocument.uploadedAt).toLocaleDateString()}
          </p>
        </div>
      )}

      <div className="flex space-x-2">
        {appointment.status === 'scheduled' && (
          <>
            <button
              onClick={() => handleStatusUpdate('completed')}
              className="px-4 py-2 bg-green-500 text-white text-sm rounded-lg hover:bg-green-600 transition-colors"
            >
              Complete
            </button>
            <button
              onClick={() => handleStatusUpdate('cancelled')}
              className="px-4 py-2 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 transition-colors"
            >
              Cancel
            </button>
          </>
        )}
      </div>

      {showUploadModal && (
        <PrescriptionUploadModal
          appointmentId={appointment._id}
          onClose={() => setShowUploadModal(false)}
        />
      )}
    </div>
  );
};

export default AppointmentCard;
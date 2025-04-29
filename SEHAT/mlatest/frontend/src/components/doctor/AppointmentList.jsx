import React from 'react';
import useDoctorStore from '../../store/doctorStore';
import AppointmentCard from './AppointmentCard';

const AppointmentList = () => {
  const { appointments } = useDoctorStore();

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {appointments.map((appointment) => (
        <AppointmentCard key={appointment._id} appointment={appointment} />
      ))}
    </div>
  );
};

export default AppointmentList;
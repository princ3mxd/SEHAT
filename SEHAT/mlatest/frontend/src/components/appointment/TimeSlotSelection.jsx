import React, { useState } from 'react';
import useAppointmentStore from '../../store/appointmentStore';
import { CalendarIcon, ClockIcon } from '@heroicons/react/24/outline';

const TimeSlotSelection = () => {
    const { selectedDoctor, setSelectedDate } = useAppointmentStore();
    const [selectedDay, setSelectedDay] = useState(null);

    // Generate next 7 days
    const days = Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() + i);
        return {
            date,
            day: date.toLocaleDateString('en-US', { weekday: 'short' }),
            dateNum: date.getDate(),
            month: date.toLocaleDateString('en-US', { month: 'short' }),
            isToday: i === 0
        };
    });

    // Generate time slots (every 30 minutes from 9 AM to 5 PM)
    const timeSlots = Array.from({ length: 17 }, (_, i) => {
        const hour = 9 + Math.floor(i / 2);
        const minutes = (i % 2) * 30;
        return `${hour.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    });

    const handleTimeSlotSelect = (time) => {
        if (selectedDay) {
            const selectedDateTime = new Date(selectedDay.date);
            const [hours, minutes] = time.split(':');
            selectedDateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
            setSelectedDate(selectedDateTime);
        }
    };

    return (
        <div className="space-y-6">
            <div className="text-center mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">Select Time Slot</h2>
                <p className="text-gray-600">Choose a convenient time for your appointment with Dr. {selectedDoctor.name}</p>
            </div>

            {/* Date Selection */}
            <div className="mb-8">
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                    <CalendarIcon className="h-5 w-5 mr-2 text-green-600" />
                    Select Date
                </h3>
                <div className="grid grid-cols-7 gap-2">
                    {days.map((day) => (
                        <button
                            key={day.dateNum}
                            onClick={() => setSelectedDay(day)}
                            className={`flex flex-col items-center justify-center p-3 rounded-lg border transition-all duration-200 ${
                                selectedDay?.dateNum === day.dateNum
                                    ? 'border-green-500 bg-green-50 text-green-700'
                                    : 'border-gray-200 hover:border-green-300 hover:bg-gray-50'
                            }`}
                        >
                            <span className={`text-sm font-medium ${day.isToday ? 'text-green-600' : 'text-gray-600'}`}>
                                {day.day}
                            </span>
                            <span className="text-lg font-semibold">{day.dateNum}</span>
                            <span className="text-xs text-gray-500">{day.month}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Time Slots */}
            {selectedDay && (
                <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                        <ClockIcon className="h-5 w-5 mr-2 text-green-600" />
                        Available Time Slots
                    </h3>
                    <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                        {timeSlots.map((time) => (
                            <button
                                key={time}
                                onClick={() => handleTimeSlotSelect(time)}
                                className="px-4 py-3 text-center rounded-lg border border-gray-200 hover:border-green-500 hover:bg-green-50 hover:text-green-700 transition-all duration-200"
                            >
                                {time}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {!selectedDay && (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                    <p className="text-gray-500">Please select a date to view available time slots.</p>
                </div>
            )}
        </div>
    );
};

export default TimeSlotSelection;
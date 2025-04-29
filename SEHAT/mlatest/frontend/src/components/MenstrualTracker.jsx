import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import Navbar from './Navbar';

const tips = [
    "Stay hydrated and eat iron-rich foods during your period.",
    "Gentle exercise can help reduce cramps.",
    "Track your mood and symptoms for better self-awareness.",
    "If you notice irregular cycles, consult a healthcare provider.",
    "Practice self-care and rest when needed."
];

const moods = ["😊 Happy", "😔 Sad", "😡 Irritable", "😴 Tired", "🤕 Cramps"];
const symptoms = ["Cramps", "Headache", "Bloating", "Tender Breasts", "Acne", "Back Pain"];

const getNextPeriod = (lastDate) => {
    if (!lastDate) return null;
    const next = new Date(lastDate);
    next.setDate(next.getDate() + 28);
    return next;
};

const getOvulation = (lastDate) => {
    if (!lastDate) return null;
    const ovulation = new Date(lastDate);
    ovulation.setDate(ovulation.getDate() + 14);
    return ovulation;
};

const MenstrualTracker = () => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [periodDates, setPeriodDates] = useState([]);
    const [logs, setLogs] = useState({});
    const [selectedMood, setSelectedMood] = useState('');
    const [selectedSymptoms, setSelectedSymptoms] = useState([]);

    const lastPeriod = periodDates.length > 0 ? periodDates[periodDates.length - 1] : null;
    const nextPeriod = getNextPeriod(lastPeriod);
    const ovulation = getOvulation(lastPeriod);

    const handleDayClick = (date) => {
        setSelectedDate(date);
        setSelectedMood(logs[date.toDateString()]?.mood || '');
        setSelectedSymptoms(logs[date.toDateString()]?.symptoms || []);
    };

    const handleLogSave = () => {
        setLogs({
            ...logs,
            [selectedDate.toDateString()]: {
                mood: selectedMood,
                symptoms: selectedSymptoms
            }
        });
    };

    const handlePeriodMark = () => {
        if (!periodDates.find(d => new Date(d).toDateString() === selectedDate.toDateString())) {
            setPeriodDates([...periodDates, selectedDate]);
        }
    };

    // Prepare chart data
    const chartData = periodDates.map((date, idx) => ({
        name: `Cycle ${idx + 1}`,
        Day: 28,
    }));

    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <div className="min-h-screen bg-gradient-to-b from-pink-50 to-purple-100 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-10">
                        <h1 className="text-4xl font-extrabold text-pink-700 mb-2">Menstrual & Reproductive Health Tracker</h1>
                        <p className="text-lg text-gray-600">Track your cycle, log symptoms, and get personalized tips!</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                        <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center">
                            <h2 className="text-xl font-bold text-pink-600 mb-4">Cycle Calendar</h2>
                            <Calendar
                                onClickDay={handleDayClick}
                                value={selectedDate}
                                tileClassName={({ date }) =>
                                    periodDates.find(d => new Date(d).toDateString() === date.toDateString())
                                        ? 'bg-pink-200 text-pink-800 font-bold rounded-full' : ''
                                }
                            />
                            <div className="mt-4 flex flex-col items-center">
                                <button
                                    className="px-4 py-2 bg-pink-500 text-white rounded-lg shadow hover:bg-pink-600"
                                    onClick={() => handleDayClick(new Date())}
                                >
                                    Log Today
                                </button>
                                {lastPeriod && (
                                    <div className="mt-4 text-sm text-gray-700">
                                        <div>Last Period: <span className="font-semibold">{new Date(lastPeriod).toLocaleDateString()}</span></div>
                                        <div>Next Period: <span className="font-semibold">{nextPeriod?.toLocaleDateString() || '-'}</span></div>
                                        <div>Ovulation: <span className="font-semibold">{ovulation?.toLocaleDateString() || '-'}</span></div>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center">
                            <h2 className="text-xl font-bold text-pink-600 mb-4">Cycle History</h2>
                            <ResponsiveContainer width="100%" height={200}>
                                <LineChart data={chartData}>
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Line type="monotone" dataKey="Day" stroke="#ec4899" strokeWidth={3} />
                                </LineChart>
                            </ResponsiveContainer>
                            <div className="mt-4 text-sm text-gray-600">
                                <div>Average Cycle Length: <span className="font-semibold">28 days</span></div>
                                <div>Cycles Tracked: <span className="font-semibold">{periodDates.length}</span></div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                        <div className="bg-white rounded-xl shadow-lg p-6">
                            <h2 className="text-xl font-bold text-pink-600 mb-4">Personalized Tips</h2>
                            <ul className="list-disc pl-5 space-y-2 text-gray-700">
                                {tips.map((tip, idx) => (
                                    <li key={idx}>{tip}</li>
                                ))}
                            </ul>
                        </div>
                        <div className="bg-white rounded-xl shadow-lg p-6">
                            <h2 className="text-xl font-bold text-pink-600 mb-4">Today's Log</h2>
                            <div className="mb-2">
                                <span className="font-medium">Mood:</span>
                                <select
                                    className="ml-2 border rounded px-2 py-1"
                                    value={selectedMood}
                                    onChange={e => setSelectedMood(e.target.value)}
                                >
                                    <option value="">Select Mood</option>
                                    {moods.map(mood => <option key={mood} value={mood}>{mood}</option>)}
                                </select>
                            </div>
                            <div className="mb-2">
                                <span className="font-medium">Symptoms:</span>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {symptoms.map(symptom => (
                                        <label key={symptom} className="flex items-center gap-1">
                                            <input
                                                type="checkbox"
                                                checked={selectedSymptoms.includes(symptom)}
                                                onChange={e => {
                                                    if (e.target.checked) setSelectedSymptoms([...selectedSymptoms, symptom]);
                                                    else setSelectedSymptoms(selectedSymptoms.filter(s => s !== symptom));
                                                }}
                                            />
                                            <span>{symptom}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                            <div className="flex gap-2 mt-4">
                                <button
                                    className="px-4 py-2 bg-pink-500 text-white rounded-lg shadow hover:bg-pink-600"
                                    onClick={handleLogSave}
                                >
                                    Save Log
                                </button>
                                <button
                                    className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg shadow hover:bg-purple-200"
                                    onClick={handlePeriodMark}
                                >
                                    Mark as Period Day
                                </button>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default MenstrualTracker; 
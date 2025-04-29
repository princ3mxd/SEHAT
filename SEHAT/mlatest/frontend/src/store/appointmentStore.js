import { create } from "zustand";
import axios from "axios";

const API_URL = "http://localhost:5000/api";

const useAppointmentStore = create((set, get) => ({
  hospitals: [],
  doctors: [],
  appointments: [],
  selectedHospital: null,
  selectedDoctor: null,
  selectedDate: null,
  loading: false,
  error: null,

  fetchHospitals: async () => {
    try {
      set({ loading: true, error: null });
      const response = await axios.get(`${API_URL}/hospital`);
      set({ hospitals: response.data });
    } catch (error) {
      set({ error: error.message });
    } finally {
      set({ loading: false });
    }
  },

  fetchDoctorsByHospital: async (hospitalId) => {
    try {
      set({ loading: true, error: null });
      const response = await axios.get(
        `${API_URL}/doctor/hospital/${hospitalId}`
      );
      set({ doctors: response.data });
    } catch (error) {
      set({ error: error.message });
    } finally {
      set({ loading: false });
    }
  },

  fetchUserAppointments: async (userId) => {
    try {
      set({ loading: true, error: null });
      const response = await axios.get(`${API_URL}/appointment/user/${userId}`);
      set({ appointments: response.data });
    } catch (error) {
      set({ error: error.message });
    } finally {
      set({ loading: false });
    }
  },

  fetchDoctorAppointments: async (doctorId) => {
    try {
      set({ loading: true, error: null });
      const response = await axios.get(
        `${API_URL}/appointment/doctor/${doctorId}`
      );
      set({ appointments: response.data });
    } catch (error) {
      set({ error: error.message });
    } finally {
      set({ loading: false });
    }
  },

  createAppointment: async (appointmentData) => {
    try {
      set({ loading: true, error: null });
      const response = await axios.post(
        `${API_URL}/appointment`,
        appointmentData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      set((state) => ({
        appointments: [...state.appointments, response.data],
      }));
      return response.data;
    } catch (error) {
      set({ error: error.message });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  updateAppointmentStatus: async (appointmentId, status) => {
    try {
      set({ loading: true, error: null });
      const response = await axios.put(
        `${API_URL}/appointment/${appointmentId}/status`,
        { status }
      );
      set((state) => ({
        appointments: state.appointments.map((appointment) =>
          appointment._id === appointmentId
            ? { ...appointment, status: status }
            : appointment
        ),
      }));
      return response.data;
    } catch (error) {
      set({ error: error.message });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  fetchAllAppointments: async () => {
    try {
      set({ loading: true, error: null });
      const response = await axios.get(`${API_URL}/appointment`);
      set({ appointments: response.data });
    } catch (error) {
      set({ error: error.message });
    } finally {
      set({ loading: false });
    }
  },

  cancelAppointment: async (appointmentId) => {
    try {
      set({ loading: true, error: null });
      await axios.put(`${API_URL}/appointment/${appointmentId}/cancel`);
      set((state) => ({
        appointments: state.appointments.map((apt) =>
          apt._id === appointmentId ? { ...apt, status: "cancelled" } : apt
        ),
      }));
    } catch (error) {
      set({ error: error.message });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  setSelectedHospital: (hospital) => {
    set({ selectedHospital: hospital });
    get().fetchDoctorsByHospital(hospital._id);
  },

  setSelectedDoctor: (doctor) => {
    set({ selectedDoctor: doctor });
  },

  setSelectedDate: (date) => {
    set({ selectedDate: date });
  },

  resetSelections: () => {
    set({
      selectedHospital: null,
      selectedDoctor: null,
      selectedDate: null,
    });
  },
}));

export default useAppointmentStore;

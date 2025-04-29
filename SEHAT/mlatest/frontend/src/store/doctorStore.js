import { create } from "zustand";
import axios from "axios";

const API_URL = "http://localhost:5000/api";

const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

const useDoctorStore = create((set) => ({
  appointments: [],
  loading: false,
  error: null,

  fetchAllAppointments: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.get("/appointment/doctor/all");
      set({
        appointments: Array.isArray(response.data) ? response.data : [],
        loading: false,
      });
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to fetch appointments",
        loading: false,
        appointments: [],
      });
    }
  },

  fetchDoctorAppointments: async (doctorId) => {
    try {
      set({ loading: true, error: null });
      if (!doctorId) {
        const response = await axiosInstance.get("/appointment");
        set({
          appointments: Array.isArray(response.data) ? response.data : [],
        });
      } else {
        const response = await axiosInstance.get(
          `/appointment/doctor/${doctorId}`
        );
        set({
          appointments: Array.isArray(response.data) ? response.data : [],
        });
      }
    } catch (error) {
      set({
        error: error.message,
        appointments: [],
      });
    } finally {
      set({ loading: false });
    }
  },

  updateAppointmentStatus: async (appointmentId, status) => {
    try {
      set({ loading: true, error: null });
      const response = await axiosInstance.put(
        `/appointment/${appointmentId}/status`,
        { status }
      );
      set((state) => ({
        appointments: state.appointments.map((appointment) =>
          appointment._id === appointmentId ? response.data : appointment
        ),
      }));
    } catch (error) {
      set({ error: error.message });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  createMeet: async (appointmentId) => {
    try {
      const response = await axiosInstance.post(
        `/meet/appointments/${appointmentId}/meet`
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to create meet");
    }
  },

  uploadPrescription: async (appointmentId, formData) => {
    try {
      set({ loading: true, error: null });

      console.log("Sending prescription with form data:", {
        appointmentId,
        file: formData.get("prescription")?.name,
      });

      const response = await axiosInstance.post(
        `/meet/appointments/${appointmentId}/prescription`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error("Upload prescription error:", error);
      set({ error: error.message });
      throw error;
    } finally {
      set({ loading: false });
    }
  },
}));

export default useDoctorStore;

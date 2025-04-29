import axios from "axios";
import { create } from "zustand";

export const useAIStore = create((set) => ({
  aiResponse: null,
  loading: false,
  error: null,

  checkSymptoms: async (symptoms) => {
    try {
      set({ loading: true, error: null });

      const res = await axios.post("http://localhost:5000/api/ai/symptoms", {
        symptoms,
      });

      set({ aiResponse: res.data.data, loading: false });
    } catch (error) {
      set({
        error: error.response?.data?.message || "Something went wrong!",
        loading: false,
      });
    }
  },
}));

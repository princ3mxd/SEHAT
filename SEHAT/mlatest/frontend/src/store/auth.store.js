import axios from "axios";
import { create } from "zustand";

axios.defaults.withCredentials = true;

export const useAuthStore = create((set) => ({
  user: null,
  token: localStorage.getItem("token") || null,
  loading: true,
  error: null,
  role: localStorage.getItem("userRole") || "user",

  checkAuth: async () => {
    try {
      set({ loading: true, error: null });
      const token = localStorage.getItem("token");

      if (!token) {
        set({ loading: false, user: null, role: "user" });
        return;
      }

      const response = await fetch("http://localhost:5000/api/auth/check", {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Authentication failed");
      }

      const data = await response.json();

      if (data.success) {
        set({
          user: data.user,
          role: data.user.role,
          token: token,
          loading: false,
          error: null,
        });
      }
    } catch (error) {
      console.error("Auth check error:", error);

      if (error.message === "Authentication failed") {
        localStorage.removeItem("userRole");
        localStorage.removeItem("token");
        set({
          user: null,
          loading: false,
          role: "user",
          token: null,
          error: null,
        });
      } else {
        set({ loading: false });
      }
    }
  },

  signup: async (userData) => {
    try {
      set({ loading: true, error: null });
      console.log("Sending signup data:", userData);

      const response = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (!response.ok) {
        set({ error: data.message || "Signup failed", loading: false });
        return false;
      }

      // Automatically log in after successful signup
      const loginResponse = await fetch(
        "http://localhost:5000/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: userData.email,
            password: userData.password,
            role: userData.role,
          }),
          credentials: "include",
        }
      );

      const loginData = await loginResponse.json();

      if (!loginResponse.ok) {
        set({
          error: loginData.message || "Auto login failed",
          loading: false,
        });
        return false;
      }

      localStorage.setItem("token", loginData.token);
      localStorage.setItem("userRole", loginData.user.role);

      set({
        user: loginData.user,
        token: loginData.token,
        role: loginData.user.role,
        loading: false,
        error: null,
      });

      return true;
    } catch (error) {
      set({ error: error.message, loading: false });
      return false;
    }
  },

  login: async (email, password, role) => {
    try {
      set({ loading: true, error: null });
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, role }),
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        set({ error: data.message || "Login failed", loading: false });
        return false;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("userRole", data.user.role);

      set({
        user: data.user,
        token: data.token,
        role: data.user.role,
        loading: false,
        error: null,
      });

      return true;
    } catch (error) {
      set({ error: error.message, loading: false });
      return false;
    }
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    set({
      user: null,
      token: null,
      role: "user",
      loading: false,
      error: null,
    });
  },

  chat: async (message) => {
    set({ isProcessing: true, err: null });
    try {
      const res = await axios.post(
        `http://localhost:5000/api/counselor/`,
        { message },
        { withCredentials: true }
      );
      console.log("Backend response:", res.data);
      set({ isProcessing: false });
      return res.data.message;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to get response";
      console.error("Chat Error:", errorMessage, error.response?.data || error);
      set({ isProcessing: false, err: errorMessage });
      throw new Error(errorMessage);
    }
  },

  fetchUnsafeLocations: async () => {
    set({ isLoadingLocations: true, locationError: null });
    try {
      const res = await axios.get("http://localhost:5000/api/unsafe");
      set({ unsafeLocations: res.data, isLoadingLocations: false });
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch locations";
      console.error(
        "Fetch Locations Error:",
        errorMessage,
        error.response?.data
      );
      set({ locationError: errorMessage, isLoadingLocations: false });
      throw new Error(errorMessage);
    }
  },

  markLocationAsUnsafe: async (lat, lng, safetyLevel = 1) => {
    set({ isLoadingLocations: true, locationError: null });
    try {
      const res = await axios.post("http://localhost:5000/api/unsafe", {
        lat: parseFloat(lat),
        lng: parseFloat(lng),
        safetyLevel: parseInt(safetyLevel),
      });
      set((state) => ({
        unsafeLocations: [...state.unsafeLocations, res.data],
        isLoadingLocations: false,
      }));
      return res.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to mark location";
      console.error("Mark Location Error:", errorMessage, error.response?.data);
      set({ locationError: errorMessage, isLoadingLocations: false });
      throw new Error(errorMessage);
    }
  },
}));

import express from "express";
import {
  createAppointment,
  getUserAppointments,
  getDoctorAppointments,
  getAppointmentById,
  updateAppointmentStatus,
  cancelAppointment,
  getAllAppointments,
} from "../controllers/appointment.controller.js";

const router = express.Router();

router.get("/", getAllAppointments);

router.get("/doctor/all", getAllAppointments);

router.post("/", createAppointment);

router.get("/user/:userId", getUserAppointments);

router.get("/doctor/:doctorId", getDoctorAppointments);

router.get("/:id", getAppointmentById);

router.put("/:id/status", updateAppointmentStatus);

router.put("/:id/cancel", cancelAppointment);

export default router;

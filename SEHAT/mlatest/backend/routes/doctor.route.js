import express from "express";
import {
  createDoctor,
  getAllDoctors,
  getDoctorsByHospital,
  getDoctorById,
  updateDoctor,
  deleteDoctor,
} from "../controllers/doctor.controller.js";

const router = express.Router();

router.get("/", getAllDoctors);
router.get("/hospital/:hospitalId", getDoctorsByHospital);
router.get("/:id", getDoctorById);
router.post("/", createDoctor);
router.put("/:id", updateDoctor);
router.delete("/:id", deleteDoctor);

export default router;

import express from "express";
import {
  createMeet,
  uploadPrescription,
} from "../controllers/meet.controller.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.post("/appointments/:appointmentId/meet", createMeet);
router.post(
  "/appointments/:appointmentId/prescription",
  upload.single("prescription"),
  uploadPrescription
);

export default router;

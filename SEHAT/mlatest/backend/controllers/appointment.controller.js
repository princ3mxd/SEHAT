import Appointment from "../models/appointment.model.js";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, "../uploads");
const healthCardsDir = path.join(uploadsDir, "health-cards");

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}
if (!fs.existsSync(healthCardsDir)) {
  fs.mkdirSync(healthCardsDir);
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, healthCardsDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, "health-card-" + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: function (req, file, cb) {
    const allowedTypes = ["application/pdf", "image/jpeg", "image/png"];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new Error(
          "Invalid file type. Only PDF, JPEG, and PNG files are allowed."
        )
      );
    }
  },
}).single("healthCardDocument");

export const createAppointment = async (req, res) => {
  try {
    upload(req, res, async function (err) {
      if (err) {
        console.error("File upload error:", err);
        if (err.code === "LIMIT_FILE_SIZE") {
          return res
            .status(400)
            .json({ message: "File size too large. Maximum size is 10MB." });
        }
        if (err.message.includes("Invalid file type")) {
          return res.status(400).json({
            message:
              "Invalid file type. Only PDF, JPEG, and PNG files are allowed.",
          });
        }
        return res.status(400).json({ message: err.message });
      }

      console.log("Received appointment data:", req.body);

      if (!req.body.doctor) {
        return res.status(400).json({ message: "Doctor ID is required" });
      }

      if (!req.body.appointmentDate) {
        return res
          .status(400)
          .json({ message: "Appointment date is required" });
      }

      const appointmentData = {
        ...req.body,
        user: req.body.user || "645a3293a95d3aa3e37898b4",
      };

      if (req.file) {
        appointmentData.healthCardDocument = {
          url: `/uploads/health-cards/${req.file.filename}`,
          uploadedAt: new Date(),
        };
        console.log("File uploaded successfully:", req.file.filename);
      }

      const appointment = new Appointment(appointmentData);
      await appointment.save();
      res.status(201).json(appointment);
    });
  } catch (error) {
    console.error("Appointment creation error:", error);
    res.status(400).json({ message: error.message });
  }
};

export const getUserAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ user: req.params.userId })
      .populate("doctor", "name specialization")
      .populate({
        path: "doctor",
        populate: {
          path: "hospital",
          select: "name address",
        },
      })
      .select("appointmentDate status meetLink")
      .sort({ appointmentDate: -1 });
    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getDoctorAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({
      doctor: req.params.doctorId,
      status: { $ne: "cancelled" },
    })
      .populate("user", "name email")
      .sort({ appointmentDate: -1 });
    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllAppointments = async (req, res) => {
  try {
    console.log("Fetching all appointments...");
    const appointments = await Appointment.find()
      .populate({
        path: "user",
        select: "name email",
        model: "User",
      })
      .populate("doctor", "name specialization")
      .populate({
        path: "doctor",
        populate: {
          path: "hospital",
          select: "name address",
        },
      })
      .sort({ appointmentDate: -1 });

    console.log(
      "Fetched appointments:",
      appointments.map((a) => ({
        id: a._id,
        user: a.user ? { name: a.user.name, email: a.user.email } : null,
      }))
    );

    res.status(200).json(appointments);
  } catch (error) {
    console.error("Error fetching appointments:", error);
    res.status(500).json({ message: error.message });
  }
};

export const getAppointmentById = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate("user", "name email")
      .populate("doctor", "name specialization")
      .populate({
        path: "doctor",
        populate: {
          path: "hospital",
          select: "name address",
        },
      });
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }
    res.status(200).json(appointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateAppointmentStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!["scheduled", "completed", "cancelled"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    )
      .populate("user", "name email")
      .populate("doctor", "name specialization");

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }
    res.status(200).json(appointment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const cancelAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status: "cancelled" },
      { new: true }
    );
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }
    res.status(200).json({ message: "Appointment cancelled successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

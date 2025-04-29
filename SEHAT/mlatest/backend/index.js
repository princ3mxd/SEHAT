import express from "express";
import dotenv from "dotenv";
import connectDB from "./db/connectDB.js";
import authRoutes from "./routes/auth.route.js";
import aiRoutes from "./routes/ai.route.js";
import hospitalRoutes from "./routes/hospital.route.js";
import doctorRoutes from "./routes/doctor.route.js";
import appointmentRoutes from "./routes/appointment.route.js";
import meetRoutes from "./routes/meet.routes.js";
import cors from "cors";
import FormData from "form-data";
import axios from "axios";
import multer from "multer";
import unsafeRoute from "./routes/unsafe.route.js";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import PDFDocument from "pdfkit";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:3000",
      "http://127.0.0.1:5173",
      "http://127.0.0.1:3000",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use(
  "/uploads/health-cards",
  express.static(path.join(__dirname, "uploads/health-cards"))
);

app.use(
  "/uploads/prescriptions",
  express.static(path.join(__dirname, "uploads/prescriptions"))
);

app.use("/api/auth", authRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/hospital", hospitalRoutes);
app.use("/api/doctor", doctorRoutes);
app.use("/api/appointment", appointmentRoutes);
app.use("/api/meet", meetRoutes);
app.use("/api/unsafe", unsafeRoute);

const prescriptionDir = path.join(__dirname, "uploads", "prescriptions");
if (!fs.existsSync(prescriptionDir)) {
  fs.mkdirSync(prescriptionDir, { recursive: true });
  console.log("Created prescriptions directory:", prescriptionDir);
}

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use(
  "/uploads/prescriptions",
  express.static(path.join(__dirname, "uploads", "prescriptions"))
);

app.post("/api/create-prescription", async (req, res) => {
  try {
    const { prescriptionData } = req.body;

    if (!prescriptionData) {
      return res.status(400).json({
        success: false,
        error: "Missing prescription data",
      });
    }

    const doc = new PDFDocument({
      size: "A4",
      margin: 40,
      bufferPages: true,
    });

    const fileName = `prescription-${Date.now()}.pdf`;
    const filePath = path.join(prescriptionDir, fileName);
    const writeStream = fs.createWriteStream(filePath);

    doc.pipe(writeStream);

    const logoPath = path.join(__dirname, "assets", "sehat.png");
    if (fs.existsSync(logoPath)) {
      doc.image(logoPath, 40, 30, { width: 60 });
    }

    doc
      .fontSize(28)
      .font("Helvetica-Bold")
      .text("SEHAT", 110, 40)
      .fontSize(14)
      .font("Helvetica")
      .text("Your Health, Our Priority", 110, 70)
      .fontSize(10)
      .text("Digital Healthcare System", 110, 90);

    // Add contact info in header
    doc
      .fontSize(9)
      .text("Contact: +91 1234567890", 400, 40, { align: "right" })
      .text("Email: care@sehat.com", 400, 55, { align: "right" })
      .text("Website: www.sehat.com", 400, 70, { align: "right" });

    doc
      .moveTo(40, 110)
      .lineTo(572, 110)
      .lineWidth(1)
      .strokeColor("#2563eb")
      .stroke();

    doc
      .moveDown(1.5)
      .font("Helvetica-Bold")
      .fontSize(22)
      .fillColor("#1e40af")
      .text("PRESCRIPTION", { align: "center" })
      .moveDown();

    doc
      .roundedRect(40, doc.y, 532, 60, 5)
      .lineWidth(1)
      .strokeColor("#e5e7eb")
      .stroke();

    const detailsY = doc.y + 10;
    doc
      .font("Helvetica-Bold")
      .fontSize(11)
      .fillColor("#374151")
      .text("PATIENT DETAILS", 50, detailsY)
      .moveDown(0.5);

    doc
      .font("Helvetica")
      .fontSize(10)
      .text(`Patient Name: ${prescriptionData.patientName}`, 50, doc.y)
      .text(
        `Date: ${new Date(prescriptionData.date).toLocaleDateString("en-IN")}`,
        400,
        doc.y - 12,
        { align: "right" }
      );

    doc
      .moveDown(2)
      .font("Helvetica-Bold")
      .fontSize(11)
      .fillColor("#374151")
      .text("PRESCRIBED MEDICINES", 50)
      .moveDown();

    const tableTop = doc.y;
    const tableHeaders = ["Medicine", "Dosage", "Frequency", "Duration"];
    const columnWidths = [200, 100, 120, 100];

    doc.font("Helvetica-Bold").fontSize(10).fillColor("#1e40af");

    let xPosition = 50;
    tableHeaders.forEach((header, i) => {
      doc.text(header, xPosition, tableTop, {
        width: columnWidths[i],
        align: "left",
      });
      xPosition += columnWidths[i] + 10;
    });

    doc
      .moveTo(40, tableTop + 20)
      .lineTo(572, tableTop + 20)
      .lineWidth(0.5)
      .strokeColor("#94a3b8")
      .stroke();

    let currentY = tableTop + 30;
    doc.font("Helvetica").fontSize(10).fillColor("#374151");

    prescriptionData.medicines.forEach((medicine, index) => {
      if (index % 2 === 0) {
        doc.rect(40, currentY - 5, 532, 25).fill("#f8fafc");
      }

      xPosition = 50;
      doc.fillColor("#374151");
      doc.text(medicine.name || "", xPosition, currentY, {
        width: columnWidths[0],
      });
      doc.text(
        medicine.dosage || "",
        xPosition + columnWidths[0] + 10,
        currentY,
        { width: columnWidths[1] }
      );
      doc.text(
        medicine.frequency || "",
        xPosition + columnWidths[0] + columnWidths[1] + 20,
        currentY,
        { width: columnWidths[2] }
      );
      doc.text(
        medicine.duration || "",
        xPosition + columnWidths[0] + columnWidths[1] + columnWidths[2] + 30,
        currentY,
        { width: columnWidths[3] }
      );

      if (medicine.instructions) {
        currentY += 20;
        doc
          .fontSize(9)
          .fillColor("#6b7280")
          .font("Helvetica-Oblique")
          .text(`Instructions: ${medicine.instructions}`, 50, currentY, {
            width: 500,
          });
      }

      currentY += 30;

      if (currentY > 700) {
        doc.addPage();
        currentY = 50;
      }
    });

    doc
      .moveTo(40, doc.page.height - 100)
      .lineTo(572, doc.page.height - 100)
      .lineWidth(0.5)
      .strokeColor("#94a3b8")
      .stroke();

    doc
      .font("Helvetica")
      .fontSize(10)
      .fillColor("#374151")
      .text("Doctor's Signature: _________________", 350, doc.page.height - 80);

    doc
      .fontSize(8)
      .fillColor("#6b7280")
      .font("Helvetica-Oblique")
      .text(
        "This is a digital prescription generated by SEHAT Healthcare System.",
        40,
        doc.page.height - 40,
        { align: "center" }
      )
      .text(
        "For any queries, please contact your healthcare provider.",
        40,
        doc.page.height - 25,
        { align: "center" }
      );

    const pages = doc.bufferedPageRange();
    for (let i = 0; i < pages.count; i++) {
      doc.switchToPage(i);
      doc
        .fontSize(8)
        .fillColor("#9ca3af")
        .text(`Page ${i + 1} of ${pages.count}`, 40, doc.page.height - 60, {
          align: "right",
        });
    }

    doc.end();

    writeStream.on("finish", () => {
      console.log("PDF created successfully at:", filePath);
      res.json({
        success: true,
        filePath: `/uploads/prescriptions/${fileName}`,
        message: "Prescription created successfully",
      });
    });

    writeStream.on("error", (err) => {
      console.error("Error writing PDF:", err);
      res.status(500).json({
        success: false,
        error: "Error creating prescription PDF",
      });
    });
  } catch (error) {
    console.error("Error creating prescription:", error);
    res.status(500).json({
      success: false,
      error: "Error creating prescription",
    });
  }
});

app.post("/api/upload-to-pinata", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: "No file provided",
      });
    }

    const data = new FormData();

    data.append("file", req.file.buffer, {
      filename: `image-${Date.now()}${req.file.originalname}`,
      contentType: req.file.mimetype,
    });

    const pinataMetadata = JSON.stringify({
      name: `image-${Date.now()}`,
      keyvalues: {
        uploadedAt: new Date().toISOString(),
        fileType: req.file.mimetype,
      },
    });
    data.append("pinataMetadata", pinataMetadata);

    const pinataOptions = JSON.stringify({
      cidVersion: 0,
    });
    data.append("pinataOptions", pinataOptions);

    const response = await axios.post(
      "https://api.pinata.cloud/pinning/pinFileToIPFS",
      data,
      {
        headers: {
          Authorization: `Bearer ${process.env.PINATA_JWT}`,
          ...data.getHeaders(),
        },
        maxBodyLength: "Infinity", // Required for large files
      }
    );

    res.json({
      success: true,
      pinataUrl: `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`,
    });
  } catch (error) {
    console.error("Error uploading to Pinata:", error);
    res.status(500).json({
      success: false,
      error: error.response?.data?.error || "Error uploading file to Pinata",
    });
  }
});

app.get("/api/pinata-files", async (req, res) => {
  try {
    const response = await axios.get("https://api.pinata.cloud/data/pinList", {
      headers: {
        Authorization: `Bearer ${process.env.PINATA_JWT}`,
      },
    });

    const files = response.data.rows.map((file) => ({
      name: file.metadata.name,
      ipfsHash: file.ipfs_pin_hash,
      url: `https://gateway.pinata.cloud/ipfs/${file.ipfs_pin_hash}`,
      timestamp: file.date_pinned,
      metadata: file.metadata,
    }));

    res.json({
      success: true,
      files,
    });
  } catch (error) {
    console.error("Error fetching Pinata files:", error);
    res.status(500).json({
      success: false,
      error: "Error fetching files from Pinata",
    });
  }
});

app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        success: false,
        error: "File is too large. Maximum size is 10MB",
      });
    }
    return res.status(400).json({
      success: false,
      error: err.message,
    });
  }
  next(err);
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: "Something broke!",
  });
});

app.listen(PORT, () => {
  connectDB();
  console.log(`Server is running on port ${PORT}`);
});

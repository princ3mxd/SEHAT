import express from "express";
import fs from "fs";
import upload from "../config/multerConfig.js";
const router = express.Router();
const uploadDir = "uploads";

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

router.post("/upload", upload.single("file"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: "No file uploaded",
      });
    }
    res.status(200).json({
      success: true,
      message: "File uploaded successfully",
      filePath: `/uploads/${req.file.filename}`,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Error uploading file",
    });
  }
});

router.get("/images", (req, res) => {
  try {
    fs.readdir(uploadDir, (err, files) => {
      if (err) {
        return res.status(500).json({
          success: false,
          error: "Failed to fetch images",
        });
      }
      const filePaths = files.map((file) => `/uploads/${file}`);
      res.status(200).json({
        success: true,
        images: filePaths,
      });
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Error fetching images",
    });
  }
});

export default router;

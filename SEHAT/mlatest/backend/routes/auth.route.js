import express from "express";
import {
  checkAuth,
  login,
  logout,
  signup,
} from "../controllers/user.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.get("/check", protect, checkAuth);

export default router;

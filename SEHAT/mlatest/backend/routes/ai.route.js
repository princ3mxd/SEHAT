import express from "express"
import checkSymptoms from "../controllers/ai.controller.js"
const router=express.Router()
router.post("/symptoms",checkSymptoms)
export default router

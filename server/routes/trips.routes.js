import express from "express";
import {
  createTrip,
  getUserTrips,
  getTripById,
} from "../controllers/trips.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";
const router = express.Router();

router.post("/", verifyToken, createTrip);
router.get("/", verifyToken, getUserTrips);
router.get("/:id", verifyToken, getTripById);

export default router;

import express from "express";
import {
  getBookings,
  getStats,
  createBooking,
  checkBooking,
  confirmPayment,
  getUserBookings,
} from "../controllers/bookingController.js";

const bookingRouter = express.Router();

bookingRouter.get("/", getBookings);
bookingRouter.get("/stats", getStats);
bookingRouter.post("/create", createBooking);
bookingRouter.get("/check", checkBooking);
bookingRouter.get("/confirm", confirmPayment);
bookingRouter.get("/my", getUserBookings);

export default bookingRouter;
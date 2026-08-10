import express from "express";
import { getBookings } from "../controllers/bookingController.js";

const bookingRouter = express.Router();

bookingRouter.get("/", getBookings);
bookingRouter.get("/stats", getStats);

bookingRouter.get("/create", createBookings);
bookingRouter.get("/check", checkBooking);
bookingRouter.get("/confirm", confirmPayment);

bookingRouter.get("/my", getUserBookings);

export default bookingRouter;
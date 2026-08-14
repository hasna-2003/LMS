import Booking from "../models/bookingModel.js";
import Course from "../models/courseModel.js";

/**
 * @desc    Get all bookings (Admin list)
 * @route   GET /api/booking/
 * @access  Admin
 */
export const getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    console.error("Error in getBookings:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve bookings",
      error: error.message,
    });
  }
};

/**
 * @desc    Get dashboard analytics & statistics
 * @route   GET /api/booking/stats
 * @access  Admin
 */
export const getStats = async (req, res) => {
  try {
    // 1. Calculate Total Bookings and Total Revenue (where Paid)
    const overallStats = await Booking.aggregate([
      {
        $group: {
          _id: null,
          totalBookings: { $sum: 1 },
          totalRevenue: {
            $sum: {
              $cond: [{ $eq: ["$paymentStatus", "Paid"] }, "$price", 0],
            },
          },
        },
      },
    ]);

    const totalBookings = overallStats[0]?.totalBookings || 0;
    const totalRevenue = overallStats[0]?.totalRevenue || 0;

    // 2. Bookings in the last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const bookingsLast7Days = await Booking.countDocuments({
      createdAt: { $gte: sevenDaysAgo },
    });

    // 3. Top courses aggregated by booking count & total revenue
    const topCourses = await Booking.aggregate([
      {
        $group: {
          _id: "$course",
          courseName: { $first: "$courseName" },
          count: { $sum: 1 },
          revenue: {
            $sum: {
              $cond: [{ $eq: ["$paymentStatus", "Paid"] }, "$price", 0],
            },
          },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 5 },
    ]);

    return res.status(200).json({
      success: true,
      stats: {
        totalBookings,
        totalRevenue,
        bookingsLast7Days,
        topCourses,
      },
    });
  } catch (error) {
    console.error("Error in getStats:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to compute booking statistics",
      error: error.message,
    });
  }
};

/**
 * @desc    Create a new booking entry
 * @route   POST /api/booking/create
 * @access  User
 */
export const createBooking = async (req, res) => {
  try {
    const {
      courseId,
      clerkUserId,
      studentName,
      notes,
      paymentIntentId,
      sessionId,
    } = req.body;

    if (!courseId || !clerkUserId) {
      return res.status(400).json({
        success: false,
        message: "courseId and clerkUserId are required",
      });
    }

    // Verify course
    const courseObj = await Course.findById(courseId);
    if (!courseObj) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // Extract price from course object structure
    const calculatedPrice =
      courseObj.price?.sale ?? courseObj.price?.original ?? courseObj.price ?? 0;

    // Generate unique booking identifier
    const bookingId = `BK-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newBooking = await Booking.create({
      bookingId,
      clerkUserId,
      studentName: studentName || "Unknown",
      course: courseObj._id.toString(),
      courseName: courseObj.name || courseObj.title || "Untitled Course",
      teacherName: courseObj.teacher || courseObj.instructor || "",
      price: calculatedPrice,
      paymentMethod: "Online",
      paymentStatus: "Unpaid",
      orderStatus: "Pending",
      paymentIntentId: paymentIntentId || null,
      sessionId: sessionId || null,
      notes: notes || "",
    });

    return res.status(201).json({
      success: true,
      message: "Booking created successfully",
      booking: newBooking,
    });
  } catch (error) {
    console.error("Error in createBooking:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create booking",
      error: error.message,
    });
  }
};

/**
 * @desc    Check if a user is already enrolled/booked in a course
 * @route   GET /api/booking/check?courseId=...&clerkUserId=...
 * @access  User
 */
export const checkBooking = async (req, res) => {
  try {
    const { courseId, clerkUserId } = req.query;

    if (!courseId || !clerkUserId) {
      return res.status(400).json({
        success: false,
        message: "courseId and clerkUserId query parameters are required",
      });
    }

    const existingBooking = await Booking.findOne({
      course: courseId,
      clerkUserId,
      paymentStatus: "Paid",
    });

    return res.status(200).json({
      success: true,
      isBooked: !!existingBooking,
      booking: existingBooking || null,
    });
  } catch (error) {
    console.error("Error in checkBooking:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to check booking status",
      error: error.message,
    });
  }
};

/**
 * @desc    Confirm payment & complete course enrollment
 * @route   GET /api/booking/confirm?bookingId=...
 * @access  User / Payment Gateway Callback
 */
export const confirmPayment = async (req, res) => {
  try {
    const { bookingId, paymentIntentId, sessionId } = req.query;

    if (!bookingId) {
      return res.status(400).json({
        success: false,
        message: "bookingId is required",
      });
    }

    const booking = await Booking.findOne({ bookingId });
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    booking.paymentStatus = "Paid";
    booking.orderStatus = "Confirmed";
    if (paymentIntentId) booking.paymentIntentId = paymentIntentId;
    if (sessionId) booking.sessionId = sessionId;

    await booking.save();

    // Increment course statistics
    await Course.findByIdAndUpdate(booking.course, {
      $inc: { students: 1, purchases: 1 },
    });

    return res.status(200).json({
      success: true,
      message: "Payment confirmed and course booking updated",
      booking,
    });
  } catch (error) {
    console.error("Error in confirmPayment:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to confirm payment",
      error: error.message,
    });
  }
};

/**
 * @desc    Get user's personal booking history
 * @route   GET /api/booking/my?clerkUserId=...
 * @access  User
 */
export const getUserBookings = async (req, res) => {
  try {
    const { clerkUserId } = req.query;

    if (!clerkUserId) {
      return res.status(400).json({
        success: false,
        message: "clerkUserId query parameter is required",
      });
    }

    const bookings = await Booking.find({ clerkUserId }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    console.error("Error in getUserBookings:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve user bookings",
      error: error.message,
    });
  }
};
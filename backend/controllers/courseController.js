import Course from "../models/courseModel.js";

/**
 * @desc    Get all courses with optional filters (category, courseType, search)
 * @route   GET /api/course
 * @access  Public
 */
export const getCourses = async (req, res) => {
  try {
    const { category, courseType, search } = req.query;
    let query = {};

    if (category) {
      query.category = category;
    }

    if (courseType) {
      query.courseType = courseType;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { teacher: { $regex: search, $options: "i" } },
      ];
    }

    const courses = await Course.find(query).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: courses.length,
      courses,
    });
  } catch (error) {
    console.error("Error in getCourses:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve courses",
      error: error.message,
    });
  }
};

/**
 * @desc    Get a single course by ID
 * @route   GET /api/course/:id
 * @access  Public
 */
export const getCourseById = async (req, res) => {
  try {
    const { id } = req.params;
    const course = await Course.findById(id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    return res.status(200).json({
      success: true,
      course,
    });
  } catch (error) {
    console.error("Error in getCourseById:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch course details",
      error: error.message,
    });
  }
};

/**
 * @desc    Create a new course with lectures & chapters (Admin)
 * @route   POST /api/course/add
 * @access  Admin
 */
export const createCourse = async (req, res) => {
  try {
    const body = req.body || {};
    const rawPrice =
      typeof body.price === "string" ? (() => {
        try {
          return JSON.parse(body.price);
        } catch {
          return {};
        }
      })() : (body.price && typeof body.price === "object" ? body.price : {});

    const name = body.name || body.title || "";
    const teacher = body.teacher || body.instructor || "";
    const overview = body.overview || body.description || "";
    const category = body.category || null;
    const pricingType = body.pricingType || "free";
    const image = body.image || body.thumbnail || req.file?.path || req.file?.filename || "";
    const originalValue = Number(
      body.originalPrice ?? rawPrice.original ?? body.priceOriginal ?? body.price?.original ?? 0
    );
    const saleValue = Number(
      body.salePrice ?? rawPrice.sale ?? body.priceSale ?? body.price?.sale ?? 0
    );
    const lectures = Array.isArray(body.lectures) ? body.lectures : [];
    const courseType = body.courseType || "regular";
    const createdBy = body.createdBy || null;

    if (!name || !teacher) {
      return res.status(400).json({
        success: false,
        message: "Course name and teacher are required fields",
      });
    }

    const courseData = {
      name,
      teacher,
      image,
      pricingType,
      price: {
        original: Number.isFinite(originalValue) ? originalValue : 0,
        sale: Number.isFinite(saleValue) ? saleValue : 0,
      },
      overview,
      lectures,
      courseType,
      category,
      createdBy,
    };

    // Instantiate and save - triggers pre("save") hook for durations and totalLectures
    const newCourse = new Course(courseData);
    await newCourse.save();

    return res.status(201).json({
      success: true,
      message: "Course created successfully",
      course: newCourse,
    });
  } catch (error) {
    console.error("Error in createCourse:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create course",
      error: error.message,
    });
  }
};

/**
 * @desc    Update course details, lectures, or chapters (Admin)
 * @route   PUT /api/course/:id
 * @access  Admin
 */
export const updateCourse = async (req, res) => {
  try {
    const { id } = req.params;

    const course = await Course.findById(id);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // Merge updated values
    Object.assign(course, req.body);

    // .save() ensures pre("save") recalculates totalDuration and totalLectures
    await course.save();

    return res.status(200).json({
      success: true,
      message: "Course updated successfully",
      course,
    });
  } catch (error) {
    console.error("Error in updateCourse:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update course",
      error: error.message,
    });
  }
};

/**
 * @desc    Add or update a rating/review for a course
 * @route   POST /api/course/:id/rate
 * @access  User
 */
export const rateCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, rating, comment } = req.body;

    if (!userId || rating == null) {
      return res.status(400).json({
        success: false,
        message: "userId and rating are required",
      });
    }

    const course = await Course.findById(id);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // Check if user already rated
    const existingIndex = course.ratings.findIndex((r) => r.userId === userId);

    if (existingIndex > -1) {
      course.ratings[existingIndex].rating = Number(rating);
      course.ratings[existingIndex].comment = comment || "";
      course.ratings[existingIndex].updatedAt = new Date();
    } else {
      course.ratings.push({
        userId,
        rating: Number(rating),
        comment: comment || "",
        updatedAt: new Date(),
      });
    }

    // Recalculate average rating
    const total = course.ratings.reduce((acc, r) => acc + r.rating, 0);
    course.totalRatings = course.ratings.length;
    course.avgRating = course.totalRatings > 0 ? Number((total / course.totalRatings).toFixed(1)) : 0;

    await course.save();

    return res.status(200).json({
      success: true,
      message: "Rating saved successfully",
      avgRating: course.avgRating,
      totalRatings: course.totalRatings,
    });
  } catch (error) {
    console.error("Error in rateCourse:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to submit rating",
      error: error.message,
    });
  }
};

/**
 * @desc    Delete a course
 * @route   DELETE /api/course/:id
 * @access  Admin
 */
export const deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;

    const course = await Course.findByIdAndDelete(id);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Course deleted successfully",
    });
  } catch (error) {
    console.error("Error in deleteCourse:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete course",
      error: error.message,
    });
  }
};
import Course from "../models/courseModel.js";
import { getAuth } from "@clerk/express";
import fs from "fs";
import path from "path";

// HELPER FUNCTIONS
const toNumber = (v, fallback = 0) => {
  if (typeof v === "number") return v;
  if (typeof v === "string" && v.trim() === "") return fallback;
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
};

const parseJSONSafe = (maybe) => {
  if (!maybe) return null;
  if (typeof maybe === "object") return maybe;
  try {
    return JSON.parse(maybe);
  } catch (e) {
    return null;
  }
};

const computeDerivedFields = (courseObj) => {
  let totalCourseMinutes = 0;
  if (!Array.isArray(courseObj.lectures)) courseObj.lectures = [];

  courseObj.lectures = courseObj.lectures.map((lec) => {
    lec = { ...lec };
    lec.duration = lec.duration || {};
    lec.chapters = Array.isArray(lec.chapters) ? lec.chapters : [];

    // normalize chapter totals
    lec.chapters = lec.chapters.map((ch) => {
      ch = { ...ch };
      ch.duration = ch.duration || {};
      const chHours = toNumber(ch.duration.hours);
      const chMins = toNumber(ch.duration.minutes);
      ch.totalMinutes = ch.totalMinutes ? toNumber(ch.totalMinutes) : chHours * 60 + chMins;

      ch.duration.hours = chHours;
      ch.duration.minutes = chMins;
      ch.name = ch.name || "";
      ch.topic = ch.topic || "";
      ch.videoUrl = ch.videoUrl || "";

      return ch;
    });

    const lecHours = toNumber(lec.duration.hours);
    const lecMins = toNumber(lec.duration.minutes);
    const lectureOwnMinutes = lecHours * 60 + lecMins;
    const chaptersMinutes = lec.chapters.reduce((s, c) => s + toNumber(c.totalMinutes, 0), 0);

    lec.totalMinutes = lectureOwnMinutes + chaptersMinutes;

    lec.duration.hours = lecHours;
    lec.duration.minutes = lecMins;

    totalCourseMinutes += lec.totalMinutes;
    lec.title = lec.title || "Untitled lecture";

    return lec;
  });

  courseObj.totalDuration = courseObj.totalDuration || {};
  courseObj.totalDuration.hours = Math.floor(totalCourseMinutes / 60);
  courseObj.totalDuration.minutes = totalCourseMinutes % 60;
  courseObj.totalLectures = Array.isArray(courseObj.lectures) ? courseObj.lectures.length : 0;

  return courseObj;
};

const makeImageAbsolute = (rawImage, req) => {
  if (!rawImage) return "";
  const image = String(rawImage || "");
  if (image.startsWith("http://") || image.startsWith("https://")) return image;
  if (image.startsWith("/")) {
    return `${req.protocol}://${req.get("host")}${image}`;
  }
  // if file stored as "uploads/filename" or just "filename"
  if (image.startsWith("uploads/")) {
    return `${req.protocol}://${req.get("host")}/${image}`;
  }
  return `${req.protocol}://${req.get("host")}/uploads/${image}`;
};

// To get public courses
export const getPublicCourses = async (req, res) => {
  try {
    const { home, type = "all", limit } = req.query;
    let filter = {};
    if (home === "true") {
      filter.courseType = "home";
    } else if (home === "top") {
      filter.courseType = "top";
    } else if (home === "regular") {
      filter.courseType = "regular";
    }

    const q = Course.find(filter).sort({ createdAt: -1 });
    if (home === "true") {
      q.limit(Number(limit) || 10);
    } else if (limit) {
      q.limit(Number(limit)); // Fixed: NUmber -> Number
    }

    const courses = await q.lean();

    const mapped = courses.map((c) => {
      return {
        ...c,
        image: makeImageAbsolute(c.image || "", req), // Fixed: undefined variable imageUrl -> makeImageAbsolute(...)
      };
    });
    return res.json({ success: true, items: mapped });
  } catch (err) {
    console.error("getPublicCourses error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get courses
export const getCourses = async (req, res) => {
  try {
    const courses = await Course.find().sort({ createdAt: -1 }).lean();
    const mapped = courses.map((c) => {
      return {
        ...c,
        image: makeImageAbsolute(c.image || "", req),
      };
    });
    return res.json({ success: true, items: mapped });
  } catch (err) {
    console.error("getCourses error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get course by id
export const getCourseById = async (req, res) => {
  try {
    const { id } = req.params;
    const course = await Course.findById(id).lean();
    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }
    // Fixed: Removed dead/unreachable code following an earlier return statement
    return res.json({
      success: true,
      item: { ...course, image: makeImageAbsolute(course.image || "", req) },
    });
  } catch (err) {
    console.error("getCourseById error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// To create a course
export const createCourse = async (req, res) => {
  try {
    const body = req.body || {};

    // image handling: store relative path so static serving works consistently
    const imagePath = req.file ? `/uploads/${req.file.filename}` : body.image || "";

    // parse price
    const priceParsed = parseJSONSafe(body.price) ?? (body.price || {});
    const price = {
      original: toNumber(priceParsed.original ?? body["price.original"] ?? 0),
      sale: toNumber(priceParsed.sale ?? body["price.sale"] ?? 0),
    };

    // lectures
    let lectures = parseJSONSafe(body.lectures) ?? body.lectures ?? [];
    if (!Array.isArray(lectures)) lectures = [];

    // normalize lectures & chapters
    lectures = lectures.map((lec) => {
      const lecture = { ...lec };
      lecture.duration = lecture.duration || {};
      lecture.duration.hours = toNumber(lecture.duration.hours);
      lecture.duration.minutes = toNumber(lecture.duration.minutes);

      lecture.chapters = Array.isArray(lecture.chapters) ? lecture.chapters : [];
      lecture.chapters = lecture.chapters.map((ch) => ({
        ...ch,
        duration: {
          hours: toNumber(ch.duration?.hours),
          minutes: toNumber(ch.duration?.minutes),
        },
        totalMinutes: toNumber(ch.totalMinutes, 0),
        videoUrl: ch.videoUrl || "",
        name: ch.name || "",
        topic: ch.topic || "",
      }));
      return {
        ...lecture,
        title: lecture.title || "Untitled lecture",
        totalMinutes: toNumber(lecture.totalMinutes, 0),
      };
    });

    const courseObj = {
      name: body.name || "",
      teacher: body.teacher || "",
      image: imagePath,
      rating: toNumber(body.rating, 0),
      pricingType: body.pricingType || "free",
      price,
      overview: body.overview || body.description || "",
      totalDuration:
        parseJSONSafe(body.totalDuration) ?? {
          hours: toNumber(body["totalDuration.hours"]),
          minutes: toNumber(body["totalDuration.minutes"]),
        },
      totalLectures: toNumber(body.totalLectures, lectures.length),
      lectures,
      courseType: body.courseType || "regular",
      category: body.category || null,
      createdBy: body.createdBy || null,
    };

    computeDerivedFields(courseObj);
    const course = new Course(courseObj);
    await course.save();

    const returned = course.toObject();
    returned.image = makeImageAbsolute(returned.image, req); // Fixed: Missing comma between parameters
    return res.status(201).json({
      success: true, // Fixed typo: succss -> success
      course: returned,
    });
  } catch (error) {
    console.error("createCourse error", error);
    return res.status(500).json({
      success: false,
      error: "Server Error",
    });
  }
};

// Delete a course by id
export const deleteCourse = async (req, res) => { // Fixed: parameter name re -> req
  try {
    const { id } = req.params;
    const course = await Course.findById(id);
    if (!course)
      return res.status(404).json({
        success: false,
        error: "Not found",
      });

    // remove upload file from local storage
    try {
      if (course.image && !course.image.startsWith("http")) { // Fixed typo: startWith -> startsWith
        const filePath = path.join(
          process.cwd(),
          course.image.startsWith("/") ? course.image.slice(1) : course.image
        );

        // Fixed syntax error: added missing semicolon/block formatting for if statement
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }
    } catch (e) {
      // ignore any errors
    }
    await course.deleteOne();
    return res.json({
      success: true, // Fixed typo: succss -> success
      message: "Course Deleted",
    });
  } catch (error) {
    console.error("deleteCourse error", error);
    return res.status(500).json({
      success: false,
      error: "Server Error",
    });
  }
};

// For rating a course by user
export const rateCourse = async (req, res) => {
  try {
    const { userId } = getAuth(req); // Fixed function call: getAuth(req)() -> getAuth(req)
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const { courseId } = req.params;
    const { rating: rawRating, comment = "" } = req.body;
    const rating = Number(rawRating);

    // Fixed syntax error: replaces invalid `~~` with logical OR `||` operators
    if (!Number.isFinite(rating) || rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: "Rating must be a number between 1 and 5",
      });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ // Fixed status code from 400 to 404
        success: false,
        message: "Course not found",
      });
    }

    // Find existing rating by this Clerk userId
    const idx = (course.ratings || []).findIndex(
      (r) => String(r.userId) === String(userId)
    );

    if (idx >= 0) {
      // update existing rating
      course.ratings[idx].rating = rating;
      if (typeof comment === "string" && comment.trim().length) {
        course.ratings[idx].comment = comment.trim();
      }
      course.ratings[idx].updatedAt = new Date();
    } else {
      // push new rating object
      course.ratings.push({
        userId,
        rating,
        comment: typeof comment === "string" ? comment.trim() : "",
      });
    }

    // Recompute aggregates (avgRating, totalRatings)
    const ratingsArr = course.ratings || [];
    const totalRatings = ratingsArr.length;
    const sum = ratingsArr.reduce((s, r) => s + (Number(r.rating) || 0), 0);
    const avgRating = totalRatings === 0 ? 0 : Number((sum / totalRatings).toFixed(2));

    course.totalRatings = totalRatings;
    course.avgRating = avgRating;

    await course.save();
    return res.json({
      success: true,
      avgRating: course.avgRating,
      totalRatings: course.totalRatings,
      myRating: { userId, rating },
    });
  } catch (error) { // Fixed: changed error parameter name to match usage (catch(error))
    console.error("rateCourse error", error);
    if (error && error.name === "ValidationError") { // Fixed: err -> error
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get myRating
export const getMyRating = async (req, res) => {
  try {
    const { userId } = getAuth(req) || {};
    if (!userId)
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });

    const { courseId } = req.params;
    const course = await Course.findById(courseId).lean();
    if (!course)
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });

    const my = (course.ratings || []).find(
      (r) => String(r.userId) === String(userId)
    ); // Fixed: removed invalid fallback `|| null` inside find callback
    
    return res.json({
      success: true,
      myRating: my ? { rating: my.rating, comment: my.comment } : null,
    });
  } catch (error) {
    console.error("getMyRating error:", error);
    return res.status(500).json({
      success: false,
      error: "Server Error",
    });
  }
};
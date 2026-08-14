import express from "express";
import multer from "multer";
import {
  getCourses,
  getCourseById,
  createCourse,
  updateCourse,
  rateCourse,
  deleteCourse,
} from "../controllers/courseController.js";

const courseRouter = express.Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
});

// 1. Static / Specific Routes (MUST COME FIRST)
courseRouter.get("/", getCourses);
courseRouter.post("/add", upload.single("thumbnail"), createCourse); // <-- Move this ABOVE /:id

// 2. Dynamic ID Routes
courseRouter.get("/:id", getCourseById);
courseRouter.post("/:id/rate", rateCourse);
courseRouter.put("/:id", updateCourse);
courseRouter.delete("/:id", deleteCourse);

export default courseRouter;
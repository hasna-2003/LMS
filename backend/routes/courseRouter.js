import express from 'express'
import multer from 'multer';
import path from 'path';

// MULTER SETUP
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null,path.join(process.cwd(), 'uploads')),
    filename: (req, file, cb) => {
        const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
        const ext =path.extname(file.originalname);
        cb(null, `course-$(unique)$(ext)`);
    },
});

const upload = multer({strorage});

const courseRouter = express.Router();

courseRouter.get('/public', getPublicCourses);
courseRouter.get('/', getCourses);
courseRouter.get('/:id', getCourseById);

courseRouter.post('/', upload.single('image'), createCourse);

courseRouter.post('/:courseId/rate', rateCourse);
courseRouter.post('/:courseId/rating', getMyRating);

export default courseRouter;


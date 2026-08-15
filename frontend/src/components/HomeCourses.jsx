import React from "react";
import { useNavigate } from "react-router-dom";
import { Star, User, ArrowRight, Clock } from "lucide-react";

// Safe wildcard imports to handle both default and named exports smoothly
import * as dummyDataModule from "../assets/dummyData";
import * as dummyStylesModule from "../assets/dummyStyles";

// Fallback Mock Courses Data if external dummyData is unavailable
const mockCourses = [
  {
    id: "1",
    name: "Full-Stack Web Development Bootcamp",
    teacher: "Dr. Sarah Jenkins",
    category: "Development",
    rating: 4.9,
    students: 1240,
    duration: "40 hrs",
    image: "https://images.unsplash.com/photo-1587620962725-abab7fe55159?auto=format&fit=crop&q=80&w=600",
    price: { sale: 499, original: 2999 },
    isFree: false,
  },
  {
    id: "2",
    name: "Mastering UI/UX & Figma Design Systems",
    teacher: "Marcus Vance",
    category: "Design",
    rating: 4.8,
    students: 890,
    duration: "25 hrs",
    image: "https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?auto=format&fit=crop&q=80&w=600",
    price: { sale: 399, original: 1999 },
    isFree: false,
  },
  {
    id: "3",
    name: "Python for Data Science & Machine Learning",
    teacher: "Elena Rostova",
    category: "Data Science",
    rating: 4.7,
    students: 2150,
    duration: "50 hrs",
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=600",
    price: { sale: 0, original: 0 },
    isFree: true,
  },
  {
    id: "4",
    name: "Modern DevOps & Cloud Infrastructure with AWS",
    teacher: "David Kim",
    category: "Cloud",
    rating: 4.9,
    students: 670,
    duration: "30 hrs",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=600",
    price: { sale: 599, original: 3499 },
    isFree: false,
  },
];

// Fallback Styles Dictionary
const fallbackStyles = {
  container: "py-16 bg-slate-50/50",
  mainContainer: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",
  header: "flex flex-col items-center text-center mb-12",
  title: "text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-3",
  fonts: { title: "", course: "" },
  coursesGrid: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8",
  courseCard:
    "group bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden cursor-pointer flex flex-col justify-between",
  imageContainer: "relative aspect-video w-full overflow-hidden bg-slate-100",
  courseImage:
    "w-full h-full object-cover group-hover:scale-105 transition-transform duration-500",
  courseInfo: "p-5 flex-1 flex flex-col justify-between",
  courseName:
    "text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-2 mb-2",
  teacherInfo: "flex items-center gap-2 text-xs text-slate-500 mb-3",
  teacherIcon: "w-4 h-4 text-slate-400",
  teacherName: "font-medium text-slate-700",
  ratingContainer: "flex items-center gap-2 mb-4",
  starsContainer: "flex items-center gap-0.5",
  starButtonActive: "w-4 h-4 text-amber-400 fill-amber-400",
  pricingContainer:
    "flex items-baseline gap-2 pt-3 border-t border-slate-100 mt-auto",
  salePrice: "text-lg font-extrabold text-slate-900",
  ctaContainer: "mt-12 text-center",
  ctaButton:
    "inline-flex items-center gap-2 px-8 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-md hover:shadow-indigo-200 transition-all duration-200",
  ctaText: "text-sm sm:text-base",
};

// Extract courses and styles without duplicate variable declarations
const courses =
  dummyDataModule.default ||
  dummyDataModule.dummyCourses ||
  dummyDataModule.courses ||
  mockCourses;

const homeCoursesStyles =
  dummyStylesModule.homeCoursesStyles ||
  dummyStylesModule.default ||
  fallbackStyles;

const HomeCourses = () => {
  const navigate = useNavigate();
  const featuredCourses = courses.slice(0, 8);

  // Formats Price with Discount handling
const renderPricing = (course) => {
  if (course?.isFree || !course?.price) {
    return (
      <span className="text-lg font-extrabold text-emerald-600">
        Free
      </span>
    );
  }

  const { sale, original } = course.price;

  // Discounted course
  if (sale != null && original != null && sale < original) {
    return (
      <div className="flex items-baseline gap-2">
        <span className="text-lg font-extrabold text-slate-900">
          Rs. {sale.toLocaleString()}
        </span>

        <span className="text-xs font-medium text-slate-400 line-through">
          Rs. {original.toLocaleString()}
        </span>
      </div>
    );
  }

  // Regular price
  return (
    <span className={homeCoursesStyles.salePrice}>
      Rs. {(sale ?? original ?? 0).toLocaleString()}
    </span>
  );
};

  return (
    <section className={homeCoursesStyles.container}>
      <div className={homeCoursesStyles.mainContainer}>
        {/* Header */}
        <div className={homeCoursesStyles.header}>
          <h2
            className={`${homeCoursesStyles.title} ${
              homeCoursesStyles.fonts?.title || ""
            }`}
          >
            Popular Courses
          </h2>
          <p className="text-center text-slate-600 max-w-2xl text-sm sm:text-base">
            Choose from a curated list of practical, beginner-friendly, and career-focused courses.
          </p>
        </div>

        {/* Courses Grid */}
        <div className={homeCoursesStyles.coursesGrid}>
          {featuredCourses.map((course) => {
            const courseRating = course.rating || 4.8;

            return (
              <article
                key={course.id}
                className={homeCoursesStyles.courseCard}
                onClick={() => navigate(`/course/${course.id}`)}
              >
                {/* Image & Category Badge */}
                <div className={homeCoursesStyles.imageContainer}>
                  <img
                    src={course.image}
                    alt={course.name}
                    className={homeCoursesStyles.courseImage}
                  />
                  {course.category && (
                    <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-md text-slate-800 text-[10px] font-bold px-2.5 py-1 rounded-md shadow-sm uppercase tracking-wider">
                      {course.category}
                    </span>
                  )}
                </div>

                {/* Course Details */}
                <div className={homeCoursesStyles.courseInfo}>
                  <div>
                    <h3
                      className={`${homeCoursesStyles.courseName} ${
                        homeCoursesStyles.fonts?.course || ""
                      }`}
                    >
                      {course.name}
                    </h3>

                    {/* Instructor */}
                    <div className={homeCoursesStyles.teacherInfo}>
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      <span className={homeCoursesStyles.teacherName}>
                        {course.teacher}
                      </span>
                    </div>

                    {/* Rating Stars */}
                    <div className={homeCoursesStyles.ratingContainer}>
                      <div className={homeCoursesStyles.starsContainer}>
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 ${
                              i < Math.round(courseRating)
                                ? "text-amber-400 fill-amber-400"
                                : "text-slate-200 fill-slate-200"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-xs font-bold text-slate-700">
                        {courseRating}
                      </span>
                      {course.students && (
                        <span className="text-[11px] text-slate-400 ml-auto">
                          ({course.students.toLocaleString()})
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Pricing Bar */}
                  <div className={homeCoursesStyles.pricingContainer}>
                    {renderPricing(course)}
                    {course.duration && (
                      <div className="ml-auto flex items-center gap-1 text-[11px] font-medium text-slate-500">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span>{course.duration}</span>
                      </div>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>


        {/* CTA Banner Button */}
    <div className={homeCoursesStyles.ctaContainer}>
  <button
    onClick={() => navigate("/courses")}
    className="inline-flex items-center gap-2 px-8 py-3.5 bg-indigo-800 hover:bg-indigo-900 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-200"
  >
    <span className={homeCoursesStyles.ctaText}>
      Browse All Courses
    </span>
    <ArrowRight className="w-4 h-4" />
  </button>
</div>
      </div>
    </section>
  );
};

export default HomeCourses;
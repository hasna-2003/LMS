import React, { useState } from "react";
import { toast, Slide } from "react-toastify";
import { SmilePlus, User as UserIcon, Star as StarIcon } from "lucide-react";

// Optional fallback styles if coursePageStyles object isn't imported from external file
const coursePageStyles = {
  coursesGrid: "max-w-7xl mx-auto px-4 py-8",
  noCoursesContainer: "flex flex-col items-center justify-center py-12 text-center",
  noCoursesIcon: "w-16 h-16 text-gray-400 mx-auto",
  noCoursesTitle: "text-xl font-semibold text-gray-700 mt-2",
  noCoursesButton: "mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors",
  coursesGridContainer: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6",
  courseCard: "bg-white border rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer overflow-hidden",
  courseCardInner: "p-4 flex flex-col h-full",
  courseCardContent: "flex flex-col h-full justify-between",
  courseImageContainer: "w-full h-40 bg-gray-100 rounded-lg overflow-hidden mb-3",
  courseImage: "w-full h-full object-cover",
  courseInfo: "flex flex-col flex-1 justify-between",
  courseName: "font-semibold text-gray-800 text-base line-clamp-2 mb-2",
  teacherContainer: "flex items-center space-x-2 text-sm text-gray-500 mb-2",
  teacherName: "text-sm text-gray-600",
  ratingContainer: "flex items-center mb-3",
  ratingStars: "flex items-center",
  ratingStarsInner: "flex items-center space-x-1",
  ratingStarButton: "p-0.5 focus:outline-none transition-transform hover:scale-110",
  priceContainer: "pt-2 border-t border-gray-100 flex items-center justify-between",
  priceFree: "text-green-600 font-bold text-lg",
  priceCurrent: "text-gray-900 font-bold text-lg",
  priceOriginal: "text-gray-400 line-through text-sm ml-2",
};

const CoursePage = () => {
  // State definitions
  const [searchQuery, setSearchQuery] = useState("");
  const [showAll, setShowAll] = useState(false);
  const [ratings, setRatings] = useState(() => {
    try {
      const raw = localStorage.getItem("userCourseRatings");
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  });

  // Example dummy course data
  const sampleCourses = [
    {
      id: "1",
      name: "Full-Stack Web Development Bootcamp",
      teacher: "John Doe",
      image: "https://via.placeholder.com/300x200?text=Web+Dev",
      price: { sale: 499, original: 999 },
    },
    {
      id: "2",
      name: "React & Tailwind CSS Masterclass",
      teacher: "Jane Smith",
      image: "https://via.placeholder.com/300x200?text=React",
      price: { sale: 0, original: 0 },
    },
    {
      id: "3",
      name: "Node.js & Express API Development",
      teacher: "Alex Johnson",
      image: "https://via.placeholder.com/300x200?text=NodeJS",
      price: { sale: null, original: 1299 },
    },
  ];

  // Helper checks
  const isCourseFree = (course) => {
    if (!course.price) return true;
    if (course.price.sale === 0 || course.price.original === 0) return true;
    return false;
  };

  // Search filtering logic
  const filteredCourses = sampleCourses.filter((course) =>
    course.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination logic
  const VISIBLE_COUNT = 8;
  const visibleCourses = showAll
    ? filteredCourses
    : filteredCourses.slice(0, VISIBLE_COUNT);
  const remainingCount = Math.max(0, filteredCourses.length - VISIBLE_COUNT);

  // Toast handler
  const showLoginToast = () => {
    toast.error("Please login to access this course", {
      position: "top-right",
      transition: Slide,
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "dark",
    });
  };

  // Course Click Handler
  const openCourse = (courseId) => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      showLoginToast();
      return;
    }
    // Navigate to course details page if logged in
    window.location.href = `/course/${courseId}`;
  };

  // Rating Handler
  const handleRating = (courseId, newRating, event) => {
    event.stopPropagation(); // Prevents triggering openCourse on card click
    const updatedRatings = { ...ratings, [courseId]: newRating };
    setRatings(updatedRatings);
    try {
      localStorage.setItem("userCourseRatings", JSON.stringify(updatedRatings));
    } catch (e) {
      console.error("Could not save rating to localStorage", e);
    }
  };

  // Price helper function
  const getPriceDisplay = (course) => {
    if (isCourseFree(course)) {
      return "Free";
    }

    if (course.price?.sale != null) {
      return {
        current: `₹${course.price.sale}`,
        original:
          course.price.original > course.price.sale
            ? `₹${course.price.original}`
            : null,
      };
    }

    if (course.price?.original != null) {
      return {
        current: `₹${course.price.original}`,
        original: null,
      };
    }

    return "Free";
  };

  return (
    <div className={coursePageStyles.coursesGrid}>
      {filteredCourses.length === 0 ? (
        <div className={coursePageStyles.noCoursesContainer}>
          <div className="text-gray-400 mb-4">
            <SmilePlus className={coursePageStyles.noCoursesIcon} />
          </div>
          <h3 className={coursePageStyles.noCoursesTitle}>No courses found</h3>
          <button
            onClick={() => {
              setSearchQuery("");
              setShowAll(false);
            }}
            className={coursePageStyles.noCoursesButton}
          >
            Show All Courses
          </button>
        </div>
      ) : (
        <>
          <div className={coursePageStyles.coursesGridContainer}>
            {visibleCourses.map((course, index) => {
              const userRating = ratings[course.id] || 0;
              const isFree = isCourseFree(course);
              const priceDisplay = getPriceDisplay(course);

              return (
                <div
                  key={course.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => openCourse(course.id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") openCourse(course.id);
                  }}
                  className={coursePageStyles.courseCard}
                  style={{ animationDelay: `${index * 80}ms` }}
                >
                  <div className={coursePageStyles.courseCardInner}>
                    <div className={coursePageStyles.courseCardContent}>
                      {/* Image */}
                      <div className={coursePageStyles.courseImageContainer}>
                        <img
                          src={course.image}
                          alt={course.name}
                          className={coursePageStyles.courseImage}
                        />
                      </div>

                      <div className={coursePageStyles.courseInfo}>
                        <h3 className={coursePageStyles.courseName}>
                          {course.name}
                        </h3>

                        <div className={coursePageStyles.teacherContainer}>
                          <UserIcon className="w-4 h-4 text-gray-500" />
                          <span className={coursePageStyles.teacherName}>
                            {course.teacher}
                          </span>
                        </div>

                        {/* Interactive rating (user) */}
                        <div className={coursePageStyles.ratingContainer}>
                          <div className={coursePageStyles.ratingStars}>
                            <div className={coursePageStyles.ratingStarsInner}>
                              {[1, 2, 3, 4, 5].map((star) => {
                                const filled = star <= userRating;
                                return (
                                  <button
                                    key={star}
                                    type="button"
                                    onClick={(e) =>
                                      handleRating(course.id, star, e)
                                    }
                                    className={coursePageStyles.ratingStarButton}
                                    aria-label={`Rate ${star} star${
                                      star > 1 ? "s" : ""
                                    }`}
                                  >
                                    <StarIcon
                                      className={`w-4 h-4 ${
                                        filled
                                          ? "text-yellow-400 fill-yellow-400"
                                          : "text-gray-300"
                                      }`}
                                    />
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        </div>

                        <div className={coursePageStyles.priceContainer}>
                          <div className="flex items-center space-x-2">
                            {isFree ? (
                              <span className={coursePageStyles.priceFree}>
                                Free
                              </span>
                            ) : (
                              <>
                                <span className={coursePageStyles.priceCurrent}>
                                  {typeof priceDisplay === "object"
                                    ? priceDisplay.current
                                    : priceDisplay}
                                </span>
                                {typeof priceDisplay === "object" &&
                                  priceDisplay.original && (
                                    <span
                                      className={coursePageStyles.priceOriginal}
                                    >
                                      {priceDisplay.original}
                                    </span>
                                  )}
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Show More Button */}
          {!showAll && remainingCount > 0 && (
            <div className="flex justify-center mt-8">
              <button
                onClick={() => setShowAll(true)}
                className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm font-medium"
              >
                Show More ({remainingCount} remaining)
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CoursePage;
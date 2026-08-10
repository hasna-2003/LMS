import React from "react";
import { useNavigate } from "react-router-dom";
import courses from "../assets/dummyData";
import { homeCoursesStyles } from "../assets/dummyStyles";

const HomeCourses = () => {
  const navigate = useNavigate();
  const featuredCourses = courses.slice(0, 8);

  const formatPrice = (course) => {
    if (course?.isFree || !course?.price) return "Free";
    if (course.price.sale != null) return `₹${course.price.sale}`;
    if (course.price.original != null) return `₹${course.price.original}`;
    return "Free";
  };

  return (
    <section className={homeCoursesStyles.container}>
      <div className={homeCoursesStyles.mainContainer}>
        <div className={homeCoursesStyles.header}>
          <h2 className={`${homeCoursesStyles.title} ${homeCoursesStyles.fonts.title}`}>
            Popular Courses
          </h2>
          <p className="text-center text-slate-600 max-w-2xl">
            Choose from a curated list of practical, beginner-friendly, and career-focused courses.
          </p>
        </div>

        <div className={homeCoursesStyles.coursesGrid}>
          {featuredCourses.map((course) => (
            <article
              key={course.id}
              className={homeCoursesStyles.courseCard}
              onClick={() => navigate(`/course/${course.id}`)}
            >
              <div className={homeCoursesStyles.imageContainer}>
                <img
                  src={course.image}
                  alt={course.name}
                  className={homeCoursesStyles.courseImage}
                />
              </div>

              <div className={homeCoursesStyles.courseInfo}>
                <h3 className={`${homeCoursesStyles.courseName} ${homeCoursesStyles.fonts.course}`}>
                  {course.name}
                </h3>
                <div className={homeCoursesStyles.teacherInfo}>
                  <span className={homeCoursesStyles.teacherIcon}>👨‍🏫</span>
                  <span className={homeCoursesStyles.teacherName}>{course.teacher}</span>
                </div>

                <div className={homeCoursesStyles.ratingContainer}>
                  <div className={homeCoursesStyles.starsContainer}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span key={star} className={homeCoursesStyles.starButtonActive}>
                        ★
                      </span>
                    ))}
                  </div>
                </div>

                <div className={homeCoursesStyles.pricingContainer}>
                  <span className={homeCoursesStyles.salePrice}>{formatPrice(course)}</span>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className={homeCoursesStyles.ctaContainer}>
          <button
            onClick={() => navigate("/courses")}
            className={homeCoursesStyles.ctaButton}
          >
            <span className={homeCoursesStyles.ctaText}>Browse All Courses</span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default HomeCourses;
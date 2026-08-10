import React, { useState, useEffect } from "react";
import { Star } from "lucide-react";
import { toast } from "react-hot-toast";
import { useAuth } from "@clerk/clerk-react";

// Replace with your actual CSS module or styles import
import homeCoursesStyles from "./HomeCourses.module.css";

const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:5000";

export default function CourseRatingList() {
  const { getToken, isSignedIn } = useAuth();

  const [courses, setCourses] = useState([]);
  const [userRatings, setUserRatings] = useState({});
  const [hoverRatings, setHoverRatings] = useState({});
  const [loading, setLoading] = useState(true);

  // Fetch courses on mount
  useEffect(() => {
    let mounted = true;

    async function fetchCourses() {
      try {
        const res = await fetch(`${API_BASE}/api/courses`);
        const json = await res.json();

        if (!mounted) return;

        const items = (json && (json.items || json.courses || [])) || [];
        const mapped = items.map((c) => ({
          id: c._id || c.id,
          name: c.name,
          teacher: c.teacher,
          image: c.image,
          price: c.price || {
            original: c.price?.original,
            sale: c.price?.sale,
          },
          isFree:
            c.pricingType === "free" ||
            !c.price ||
            (c.price && !c.price.sale && !c.price.original),
          avgRating:
            typeof c.avgRating !== "undefined" ? c.avgRating : c.rating || 0,
          totalRatings:
            typeof c.totalRatings !== "undefined"
              ? c.totalRatings
              : c.ratingCount || 0,
          courseType: c.courseType || "regular",
        }));

        setCourses(mapped);
      } catch (err) {
        console.error("Failed to fetch courses:", err);
        toast.error("Failed to load courses");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchCourses();

    return () => {
      mounted = false;
    };
  }, []);

  // Submit rating to API
  const submitRatingToServer = async (courseId, ratingValue) => {
    try {
      const headers = { "Content-Type": "application/json" };

      if (getToken) {
        const token = await getToken().catch(() => null);
        if (token) headers.Authorization = `Bearer ${token}`;
      }

      const res = await fetch(`${API_BASE}/api/course/${courseId}/rate`, {
        method: "POST",
        headers,
        credentials: "include",
        body: JSON.stringify({ rating: ratingValue }),
      });

      const data = await res.json().catch(() => ({ success: false }));

      if (!res.ok && !data.success) {
        const msg =
          (data && (data.message || data.error)) ||
          `Failed to rate (${res.status})`;
        throw new Error(msg);
      }

      // Extract new aggregate ratings from server response
      const avg = data.avgRating ?? data.course?.avgRating;
      const total = data.totalRatings ?? data.course?.ratingCount;

      // Update UI state with updated server values
      setCourses((prev) =>
        prev.map((c) =>
          c.id === courseId
            ? {
                ...c,
                avgRating: typeof avg === "number" ? avg : c.avgRating,
                totalRatings:
                  typeof total === "number" ? total : c.totalRatings,
              }
            : c
        )
      );

      // Save user rating locally
      setUserRatings((prev) => ({ ...prev, [courseId]: ratingValue }));

      toast.success("Thanks for your rating!");
      return { success: true, avg, total };
    } catch (err) {
      console.error("submitRatingToServer:", err);
      toast.error(err.message || "Failed to submit rating");
      return { success: false, error: err };
    }
  };

  // Missing Click Handler
  const handleSetRating = async (e, courseId, ratingValue) => {
    e.stopPropagation();

    if (!isSignedIn) {
      toast.error("Please sign in to rate this course.");
      return;
    }

    await submitRatingToServer(courseId, ratingValue);
  };

  // Render Star Rating Component
  const renderInteractiveStars = (course) => {
    const userRating = userRatings[course.id] || 0;
    const hover = hoverRatings[course.id] || 0;
    const baseDisplay = userRating || Math.round(course.avgRating || 0);
    const displayRating = hover || baseDisplay;

    return (
      <div
        className={homeCoursesStyles.starsContainer}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={homeCoursesStyles.interactiveStars}>
          {Array.from({ length: 5 }).map((_, i) => {
            const idx = i + 1;
            const filled = idx <= displayRating;
            return (
              <button
                key={i}
                type="button"
                aria-label={`Rate ${idx} star${idx > 1 ? "s" : ""}`}
                onClick={(e) => handleSetRating(e, course.id, idx)}
                onMouseEnter={() =>
                  setHoverRatings((s) => ({ ...s, [course.id]: idx }))
                }
                onMouseLeave={() =>
                  setHoverRatings((s) => ({ ...s, [course.id]: 0 }))
                }
                className={`${homeCoursesStyles.starButton} ${
                  filled
                    ? homeCoursesStyles.starButtonActive
                    : homeCoursesStyles.starButtonInactive
                }`}
                style={{ background: "transparent", border: "none", cursor: "pointer" }}
              >
                <Star
                  size={16}
                  fill={filled ? "currentColor" : "none"}
                  stroke="currentColor"
                  className={homeCoursesStyles.starIcon}
                />
              </button>
            );
          })}
        </div>

        <div
          style={{
            marginLeft: 8,
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <span style={{ fontWeight: 600 }}>
            {(course.avgRating || 0).toFixed(1)}
          </span>
          <span style={{ color: "#6b7280", fontSize: 12 }}>
            ({course.totalRatings || 0})
          </span>
        </div>
      </div>
    );
  };

  if (loading) return <div>Loading courses...</div>;

  return (
    <div className={homeCoursesStyles.courseList}>
      {courses.map((course) => (
        <div key={course.id} className={homeCoursesStyles.courseCard}>
          <h3>{course.name}</h3>
          <p>Teacher: {course.teacher}</p>
          {renderInteractiveStars(course)}
        </div>
      ))}
    </div>
  );
}
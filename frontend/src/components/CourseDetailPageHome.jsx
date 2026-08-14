import React, { useMemo, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Play,
  Clock,
  BookOpen,
  ChevronDown,
  CheckCircle,
  Circle,
  X,
  ArrowLeft,
  User,
  Award,
  Target,
  ArrowRight,
  Sparkles,
} from "lucide-react";

import coursesData from "../../assets/dummyHdata";
import {
  courseDetailStylesH,
  toastStyles,
  animationDelaysH,
  courseDetailCustomStyles,
} from "../../assets/dummyStyles";

/* =========================================================
   HELPERS
========================================================= */

const fmtMinutes = (mins) => {
  const minutes = Number(mins) || 0;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;

  if (h === 0) {
    return `${m}m`;
  }

  if (m === 0) {
    return `${h}h`;
  }

  return `${h}h ${m}m`;
};

/* =========================================================
   TOAST
========================================================= */

const Toast = ({ message, type = "info", onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className={`${toastStyles.toast} ${
        type === "error"
          ? toastStyles.toastError
          : toastStyles.toastInfo
      }`}
    >
      <div className={toastStyles.toastContent}>
        <span>{message}</span>

        <button
          type="button"
          onClick={onClose}
          className={toastStyles.toastClose}
          aria-label="Close notification"
        >
          <X className={toastStyles.toastCloseIcon} />
        </button>
      </div>
    </div>
  );
};

/* =========================================================
   VIDEO URL HELPERS
========================================================= */

const toEmbedUrl = (url) => {
  if (!url) return "";

  try {
    const trimmed = String(url).trim();

    if (!trimmed) {
      return "";
    }

    // Already an embed URL
    if (
      trimmed.includes("youtube.com/embed/") ||
      trimmed.includes("youtube-nocookie.com/embed/")
    ) {
      return trimmed;
    }

    // YouTube watch URL
    const watchMatch = trimmed.match(/[?&]v=([^&#]+)/);

    if (watchMatch?.[1]) {
      return `https://www.youtube.com/embed/${watchMatch[1]}`;
    }

    // youtu.be URL
    const shortMatch = trimmed.match(
      /youtu\.be\/([^?&#/]+)/
    );

    if (shortMatch?.[1]) {
      return `https://www.youtube.com/embed/${shortMatch[1]}`;
    }

    // youtube.com/shorts/VIDEO_ID
    const shortsMatch = trimmed.match(
      /youtube\.com\/shorts\/([^?&#/]+)/
    );

    if (shortsMatch?.[1]) {
      return `https://www.youtube.com/embed/${shortsMatch[1]}`;
    }

    // If the final path segment looks like a YouTube ID
    const lastSegment = trimmed
      .split("/")
      .filter(Boolean)
      .pop();

    if (lastSegment && /^[a-zA-Z0-9_-]{11}$/.test(lastSegment)) {
      return `https://www.youtube.com/embed/${lastSegment}`;
    }

    // Other video provider / already valid URL
    return trimmed;
  } catch (error) {
    console.error("Error converting video URL:", error);
    return String(url);
  }
};

const appendAutoplay = (embedUrl, autoplay = true) => {
  if (!embedUrl) {
    return "";
  }

  if (!autoplay) {
    return embedUrl;
  }

  return embedUrl.includes("?")
    ? `${embedUrl}&autoplay=1`
    : `${embedUrl}?autoplay=1`;
};

/* =========================================================
   COURSE DETAIL COMPONENT
========================================================= */

const CourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  /* -------------------------------------------------------
     COURSE
  ------------------------------------------------------- */

  const courseId = Number.parseInt(id, 10);

  const course = useMemo(() => {
    if (Number.isNaN(courseId)) {
      return null;
    }

    return coursesData.find(
      (item) => Number(item.id) === courseId
    );
  }, [courseId]);

  /* -------------------------------------------------------
     COURSE PRICE
  ------------------------------------------------------- */

  const priceObj = course?.price;

  const hasPriceObject =
    priceObj &&
    typeof priceObj === "object" &&
    (priceObj.sale != null || priceObj.original != null);

  const salePrice =
    hasPriceObject && priceObj.sale != null
      ? Number(priceObj.sale)
      : null;

  const originalPrice =
    hasPriceObject && priceObj.original != null
      ? Number(priceObj.original)
      : null;

  const courseIsFree =
    Boolean(course?.isFree) ||
    !course?.price ||
    (salePrice === 0 && originalPrice == null);

  const formatCurrency = (amount) => {
    if (
      amount == null ||
      Number.isNaN(Number(amount))
    ) {
      return "";
    }

    return `₹${Number(amount).toLocaleString("en-IN")}`;
  };

  const hasDiscount =
    originalPrice != null &&
    salePrice != null &&
    originalPrice > salePrice;

  /* -------------------------------------------------------
     AUTHENTICATION
     
     Replace this with your real authentication state.
  ------------------------------------------------------- */

  const [isLoggedIn] = useState(true);

  /* -------------------------------------------------------
     ENROLLMENT
  ------------------------------------------------------- */

  const [isEnrolled, setIsEnrolled] = useState(
    courseIsFree
  );

  const [isEnrolling, setIsEnrolling] = useState(false);

  /* -------------------------------------------------------
     UI STATE
  ------------------------------------------------------- */

  const [toast, setToast] = useState(null);

  const [expandedLectures, setExpandedLectures] =
    useState(new Set());

  const [completedChapters, setCompletedChapters] =
    useState(new Set());

  const [isTeacherAnimating, setIsTeacherAnimating] =
    useState(false);

  const [isPageLoaded, setIsPageLoaded] =
    useState(false);

  const [selectedContent, setSelectedContent] = useState({
    type: "lecture",
    lectureId: null,
    chapterId: null,
  });

  /* -------------------------------------------------------
     RESET STATE WHEN COURSE CHANGES
  ------------------------------------------------------- */

  useEffect(() => {
    setSelectedContent({
      type: "lecture",
      lectureId: null,
      chapterId: null,
    });

    setExpandedLectures(new Set());
    setCompletedChapters(new Set());

    // Free courses are immediately accessible.
    // Paid courses require enrollment.
    setIsEnrolled(courseIsFree);

    setIsEnrolling(false);
  }, [courseId, courseIsFree]);

  /* -------------------------------------------------------
     TEACHER ANIMATION
  ------------------------------------------------------- */

  useEffect(() => {
    setIsTeacherAnimating(true);

    const timer = setTimeout(() => {
      setIsTeacherAnimating(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [courseId]);

  /* -------------------------------------------------------
     PAGE LOAD ANIMATION
  ------------------------------------------------------- */

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsPageLoaded(true);
    }, 50);

    return () => clearTimeout(timer);
  }, []);

  /* =======================================================
     SELECTED LECTURE
  ======================================================= */

  const selectedLecture = useMemo(() => {
    if (!course || selectedContent.lectureId == null) {
      return null;
    }

    return (
      (course.lectures || []).find(
        (lecture) =>
          Number(lecture.id) ===
          Number(selectedContent.lectureId)
      ) || null
    );
  }, [
    course,
    selectedContent.lectureId,
  ]);

  /* =======================================================
     SELECTED CHAPTER
  ======================================================= */

  const selectedChapter = useMemo(() => {
    if (
      !selectedLecture ||
      selectedContent.chapterId == null
    ) {
      return null;
    }

    return (
      (selectedLecture.chapters || []).find(
        (chapter) =>
          Number(chapter.id) ===
          Number(selectedContent.chapterId)
      ) || null
    );
  }, [
    selectedLecture,
    selectedContent.chapterId,
  ]);

  /* =======================================================
     CURRENT VIDEO
  ======================================================= */

  const currentVideoContent = useMemo(() => {
    if (
      selectedContent.type === "chapter" &&
      selectedChapter
    ) {
      return selectedChapter;
    }

    if (
      selectedContent.type === "lecture" &&
      selectedLecture
    ) {
      return selectedLecture;
    }

    return null;
  }, [
    selectedContent.type,
    selectedLecture,
    selectedChapter,
  ]);

  /* =======================================================
     TOTAL COURSE DURATION
  ======================================================= */

  const totalMinutes = useMemo(() => {
    if (!course) {
      return 0;
    }

    return (course.lectures || []).reduce(
      (total, lecture) =>
        total + (Number(lecture.durationMin) || 0),
      0
    );
  }, [course]);

  /* =======================================================
     TOTAL CHAPTERS
  ======================================================= */

  const totalChapters = useMemo(() => {
    if (!course) {
      return 0;
    }

    return (course.lectures || []).reduce(
      (total, lecture) =>
        total + (lecture.chapters?.length || 0),
      0
    );
  }, [course]);

  /* =======================================================
     COURSE PROGRESS
  ======================================================= */

  const progressPercentage =
    totalChapters > 0
      ? Math.min(
          100,
          Math.round(
            (completedChapters.size / totalChapters) *
              100
          )
        )
      : 0;

  /* =======================================================
     TOGGLE LECTURE
  ======================================================= */

  const toggleLecture = (lectureId) => {
    setExpandedLectures((previous) => {
      const next = new Set(previous);

      if (next.has(lectureId)) {
        next.delete(lectureId);
      } else {
        next.add(lectureId);
      }

      return next;
    });
  };

  /* =======================================================
     SELECT CONTENT
  ======================================================= */

  const handleContentSelect = (
    lectureId,
    chapterId = null
  ) => {
    // Login check
    if (!isLoggedIn) {
      setToast({
        message:
          "Please login to access course content.",
        type: "error",
      });

      return;
    }

    // Enrollment check
    if (!isEnrolled && !courseIsFree) {
      setToast({
        message:
          "Please enroll in the course to access content.",
        type: "error",
      });

      return;
    }

    setSelectedContent({
      type: chapterId != null ? "chapter" : "lecture",
      lectureId,
      chapterId,
    });

    // Automatically expand selected lecture
    setExpandedLectures((previous) => {
      const next = new Set(previous);
      next.add(lectureId);
      return next;
    });
  };

  /* =======================================================
     LECTURE HEADER CLICK
  ======================================================= */

  const onLectureHeaderClick = (lectureId) => {
    const isOpen = expandedLectures.has(lectureId);

    // Collapse
    if (isOpen) {
      setExpandedLectures((previous) => {
        const next = new Set(previous);
        next.delete(lectureId);
        return next;
      });

      // Clear selected content if this lecture was selected
      if (
        Number(selectedContent.lectureId) ===
        Number(lectureId)
      ) {
        setSelectedContent({
          type: "lecture",
          lectureId: null,
          chapterId: null,
        });
      }

      return;
    }

    // Login check
    if (!isLoggedIn) {
      setToast({
        message:
          "Please login to view course content.",
        type: "error",
      });

      return;
    }

    // Enrollment check
    if (!isEnrolled && !courseIsFree) {
      setToast({
        message:
          "Please enroll in the course to view chapters.",
        type: "error",
      });

      return;
    }

    // Expand
    toggleLecture(lectureId);

    // Select lecture
    setSelectedContent({
      type: "lecture",
      lectureId,
      chapterId: null,
    });
  };

  /* =======================================================
     CHAPTER COMPLETION
  ======================================================= */

  const toggleChapterCompletion = (
    chapterId,
    event = null
  ) => {
    if (event) {
      event.stopPropagation();
    }

    if (
      !isLoggedIn ||
      (!isEnrolled && !courseIsFree)
    ) {
      setToast({
        message:
          "Please login and enroll to track progress.",
        type: "error",
      });

      return;
    }

    setCompletedChapters((previous) => {
      const next = new Set(previous);

      if (next.has(chapterId)) {
        next.delete(chapterId);
      } else {
        next.add(chapterId);
      }

      return next;
    });
  };

  /* =======================================================
     ENROLL
  ======================================================= */

  const handleEnroll = async () => {
    if (!isLoggedIn) {
      setToast({
        message:
          "Please login to enroll in the course.",
        type: "error",
      });

      return;
    }

    if (courseIsFree) {
      setIsEnrolled(true);

      setToast({
        message:
          "You already have free access to this course.",
        type: "info",
      });

      return;
    }

    if (isEnrolled) {
      return;
    }

    try {
      setIsEnrolling(true);

      // ---------------------------------------------------
      // Replace this simulated request with your backend API
      // ---------------------------------------------------

      await new Promise((resolve) =>
        setTimeout(resolve, 1500)
      );

      setIsEnrolled(true);

      setToast({
        message:
          "Successfully enrolled in the course! You can now access all content.",
        type: "info",
      });
    } catch (error) {
      console.error("Enrollment error:", error);

      setToast({
        message:
          "Something went wrong while enrolling. Please try again.",
        type: "error",
      });
    } finally {
      setIsEnrolling(false);
    }
  };

  /* =======================================================
     NAVIGATION
  ======================================================= */

  const handleBackToHome = () => {
    navigate("/");
  };

  /* =======================================================
     COURSE NOT FOUND
  ======================================================= */

  if (!course) {
    return (
      <div
        className={
          courseDetailStylesH.notFoundContainer
        }
      >
        {/* Background Pattern */}
        <div
          className={
            courseDetailStylesH.notFoundPattern
          }
        >
          <div
            className={`${courseDetailStylesH.notFoundBlob} top-10 left-10 bg-purple-300`}
          />

          <div
            className={`${courseDetailStylesH.notFoundBlob} top-10 right-10 bg-yellow-300 ${animationDelaysH.delay2000}`}
          />

          <div
            className={`${courseDetailStylesH.notFoundBlob} bottom-10 left-20 bg-pink-300 ${animationDelaysH.delay4000}`}
          />
        </div>

        <div
          className={
            courseDetailStylesH.notFoundContent
          }
        >
          <h2
            className={
              courseDetailStylesH.notFoundTitle
            }
          >
            Course not found
          </h2>

          <p
            className={
              courseDetailStylesH.notFoundText
            }
          >
            The course you are looking for does not
            exist.
          </p>

          <button
            type="button"
            onClick={() => navigate("/courses")}
            className={
              courseDetailStylesH.notFoundButton
            }
          >
            Back to Courses
          </button>
        </div>
      </div>
    );
  }

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div className={courseDetailStylesH.pageContainer}>
      {/* Toast */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div
        className={`${courseDetailStylesH.mainContainer} ${
          isPageLoaded
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-8"
        }`}
      >
        {/* =================================================
            HEADER
        ================================================= */}

        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={handleBackToHome}
            className={courseDetailStylesH.backButton}
          >
            <ArrowLeft
              className={
                courseDetailStylesH.backButtonIcon
              }
            />

            <span
              className={
                courseDetailStylesH.backButtonText
              }
            >
              Back to Home
            </span>
          </button>
        </div>

        {/* =================================================
            COURSE HEADER
        ================================================= */}

        <div
          className={
            courseDetailStylesH.headerContainer
          }
        >
          {/* Course Badge */}
          <div
            className={
              courseDetailStylesH.courseBadge
            }
          >
            <BookOpen
              className={
                courseDetailStylesH.badgeIcon
              }
            />

            <span
              className={
                courseDetailStylesH.badgeText
              }
            >
              {courseIsFree
                ? "Free Course"
                : "Premium Course"}
            </span>
          </div>

          {/* Course Title */}
          <h1
            className={
              courseDetailStylesH.courseTitle
            }
          >
            {course.name}
          </h1>

          {/* Course Overview */}
          {course.overview && (
            <div
              className={
                courseDetailStylesH.overviewContainer
              }
            >
              <div
                className={
                  courseDetailStylesH.overviewCard
                }
              >
                <div
                  className={
                    courseDetailStylesH.overviewHeader
                  }
                >
                  <Target
                    className={
                      courseDetailStylesH.overviewIcon
                    }
                  />

                  <h3
                    className={
                      courseDetailStylesH.overviewTitle
                    }
                  >
                    Course Overview
                  </h3>
                </div>

                <p
                  className={
                    courseDetailStylesH.overviewText
                  }
                >
                  {course.overview}
                </p>
              </div>
            </div>
          )}

          {/* Course Stats */}
          <div
            className={`${courseDetailStylesH.statsContainer} ${animationDelaysH.delay300}`}
          >
            {/* Duration */}
            <div
              className={
                courseDetailStylesH.statItem
              }
            >
              <Clock
                className={
                  courseDetailStylesH.statIcon
                }
              />

              <span
                className={
                  courseDetailStylesH.statText
                }
              >
                {fmtMinutes(totalMinutes)}
              </span>
            </div>

            {/* Lectures */}
            <div
              className={
                courseDetailStylesH.statItem
              }
            >
              <BookOpen
                className={
                  courseDetailStylesH.statIcon
                }
              />

              <span
                className={
                  courseDetailStylesH.statText
                }
              >
                {(course.lectures || []).length}{" "}
                lectures
              </span>
            </div>

            {/* Teacher */}
            <div
              className={`${courseDetailStylesH.teacherStat} ${
                isTeacherAnimating
                  ? "scale-110 bg-indigo-100/50"
                  : ""
              }`}
            >
              <User
                className={
                  courseDetailStylesH.teacherIcon
                }
              />

              <span
                className={
                  courseDetailStylesH.teacherText
                }
              >
                {course.teacher || "Instructor"}
              </span>
            </div>
          </div>
        </div>

        {/* =================================================
            MAIN CONTENT GRID
        ================================================= */}

        <div className={courseDetailStylesH.mainGrid}>
          {/* =================================================
              VIDEO SECTION
          ================================================= */}

          <div
            className={
              courseDetailStylesH.videoSection
            }
          >
            <div
              className={
                courseDetailStylesH.videoContainer
              }
            >
              {/* Video */}
              <div
                className={
                  courseDetailStylesH.videoWrapper
                }
              >
                {currentVideoContent?.videoUrl ? (
                  <iframe
                    title={
                      currentVideoContent.title ||
                      currentVideoContent.name ||
                      "Course video"
                    }
                    src={appendAutoplay(
                      toEmbedUrl(
                        currentVideoContent.videoUrl
                      ),
                      isLoggedIn &&
                        (isEnrolled || courseIsFree)
                    )}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className={
                      courseDetailStylesH.videoFrame
                    }
                  />
                ) : (
                  <div
                    className={
                      courseDetailStylesH.videoPlaceholder
                    }
                  >
                    <div
                      className={
                        courseDetailStylesH.videoPlaceholderPattern
                      }
                    >
                      <div
                        className={`${courseDetailStylesH.videoPlaceholderBlob} top-1/4 left-1/4 bg-purple-500`}
                      />

                      <div
                        className={`${courseDetailStylesH.videoPlaceholderBlob} bottom-1/4 right-1/4 bg-blue-500`}
                      />
                    </div>

                    <div
                      className={
                        courseDetailStylesH.videoPlaceholderContent
                      }
                    >
                      <div
                        className={
                          courseDetailStylesH.videoPlaceholderIcon
                        }
                      >
                        <Play
                          className={
                            courseDetailStylesH.videoPlaceholderPlayIcon
                          }
                        />
                      </div>

                      <p
                        className={
                          courseDetailStylesH.videoPlaceholderText
                        }
                      >
                        Select a lecture or chapter to
                        play video
                      </p>

                      {(!isLoggedIn ||
                        !(isEnrolled ||
                          courseIsFree)) && (
                        <p
                          className={
                            courseDetailStylesH.videoPlaceholderSubtext
                          }
                        >
                          {!isLoggedIn
                            ? "Login required"
                            : "Enrollment required"}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Video Information */}
              <div
                className={
                  courseDetailStylesH.videoInfo
                }
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3
                      className={
                        courseDetailStylesH.videoTitle
                      }
                    >
                      {currentVideoContent?.title ||
                        currentVideoContent?.name ||
                        "Select content to play"}
                    </h3>

                    <p
                      className={
                        courseDetailStylesH.videoDescription
                      }
                    >
                      {selectedContent.type ===
                        "chapter" &&
                      selectedLecture
                        ? `Part of: ${selectedLecture.title}`
                        : currentVideoContent?.description ||
                          "Choose a lecture or chapter from the course content."}
                    </p>

                    {currentVideoContent?.durationMin !=
                      null && (
                      <div
                        className={
                          courseDetailStylesH.videoMeta
                        }
                      >
                        <div
                          className={
                            courseDetailStylesH.durationBadge
                          }
                        >
                          <Clock
                            className={
                              courseDetailStylesH.durationIcon
                            }
                          />

                          <span>
                            {fmtMinutes(
                              currentVideoContent.durationMin
                            )}
                          </span>
                        </div>

                        {selectedContent.type ===
                          "chapter" && (
                          <span
                            className={
                              courseDetailStylesH.chapterBadge
                            }
                          >
                            Chapter
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Completion Button */}
                {isLoggedIn &&
                  (isEnrolled || courseIsFree) &&
                  selectedContent.chapterId != null && (
                    <div
                      className={
                        courseDetailStylesH.completionSection
                      }
                    >
                      <button
                        type="button"
                        onClick={() =>
                          toggleChapterCompletion(
                            selectedContent.chapterId
                          )
                        }
                        className={`${
                          courseDetailStylesH.completionButton
                        } ${
                          completedChapters.has(
                            selectedContent.chapterId
                          )
                            ? courseDetailStylesH.completionButtonCompleted
                            : courseDetailStylesH.completionButtonIncomplete
                        }`}
                      >
                        {completedChapters.has(
                          selectedContent.chapterId
                        ) ? (
                          <>
                            <CheckCircle
                              className={
                                courseDetailStylesH.completionIcon
                              }
                            />

                            Chapter Completed
                          </>
                        ) : (
                          <>
                            <Circle
                              className={
                                courseDetailStylesH.completionIcon
                              }
                            />

                            Mark as Complete
                          </>
                        )}
                      </button>

                      <p
                        className={
                          courseDetailStylesH.completionText
                        }
                      >
                        {completedChapters.has(
                          selectedContent.chapterId
                        )
                          ? "Great job! You've completed this chapter."
                          : "Click to mark this chapter as completed."}
                      </p>
                    </div>
                  )}
              </div>
            </div>
          </div>

          {/* =================================================
              SIDEBAR
          ================================================= */}

          <aside
            className={courseDetailStylesH.sidebar}
          >
            {/* =================================================
                COURSE CONTENT
            ================================================= */}

            <div
              className={`${courseDetailStylesH.sidebarCard} ${animationDelaysH.delay200}`}
            >
              <div
                className={
                  courseDetailStylesH.contentHeader
                }
              >
                <h4
                  className={
                    courseDetailStylesH.contentTitle
                  }
                >
                  Course Content
                </h4>

                {courseIsFree && (
                  <div
                    className={
                      courseDetailStylesH.freeAccessBadge
                    }
                  >
                    <Sparkles
                      className={
                        courseDetailStylesH.freeAccessIcon
                      }
                    />

                    Free Access
                  </div>
                )}
              </div>

              <div
                className={
                  courseDetailStylesH.contentList
                }
              >
                {(course.lectures || []).map(
                  (lecture, index) => {
                    const lectureId = lecture.id;
                    const isExpanded =
                      expandedLectures.has(
                        lectureId
                      );

                    return (
                      <div
                        key={lectureId}
                        className={
                          courseDetailStylesH.lectureItem
                        }
                        style={{
                          animationDelay: `${
                            index * 100
                          }ms`,
                        }}
                      >
                        {/* Lecture Header */}
                        <div
                          className={`${
                            courseDetailStylesH.lectureHeader
                          } ${
                            isExpanded
                              ? courseDetailStylesH.lectureHeaderExpanded
                              : courseDetailStylesH.lectureHeaderNormal
                          }`}
                          onClick={() =>
                            onLectureHeaderClick(
                              lectureId
                            )
                          }
                          role="button"
                          tabIndex={0}
                          onKeyDown={(event) => {
                            if (
                              event.key === "Enter" ||
                              event.key === " "
                            ) {
                              event.preventDefault();

                              onLectureHeaderClick(
                                lectureId
                              );
                            }
                          }}
                        >
                          <div
                            className={
                              courseDetailStylesH.lectureContent
                            }
                          >
                            <div
                              className={
                                courseDetailStylesH.lectureLeft
                              }
                            >
                              <div
                                className={`${
                                  courseDetailStylesH.lectureChevron
                                } ${
                                  isExpanded
                                    ? courseDetailStylesH.lectureChevronExpanded
                                    : courseDetailStylesH.lectureChevronNormal
                                }`}
                              >
                                <ChevronDown className="w-5 h-5" />
                              </div>

                              <div
                                className={
                                  courseDetailStylesH.lectureInfo
                                }
                              >
                                <div
                                  className={
                                    courseDetailStylesH.lectureTitle
                                  }
                                >
                                  {lecture.title}
                                </div>

                                <div
                                  className={
                                    courseDetailStylesH.lectureMeta
                                  }
                                >
                                  <div
                                    className={
                                      courseDetailStylesH.lectureDuration
                                    }
                                  >
                                    <Clock
                                      className={
                                        courseDetailStylesH.lectureDurationIcon
                                      }
                                    />

                                    {fmtMinutes(
                                      lecture.durationMin
                                    )}
                                  </div>

                                  <span
                                    className={
                                      courseDetailStylesH.lectureChaptersCount
                                    }
                                  >
                                    {lecture.chapters
                                      ?.length || 0}{" "}
                                    chapters
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Chapters */}
                        {isExpanded && (
                          <div
                            className={
                              courseDetailStylesH.chaptersList
                            }
                          >
                            {(lecture.chapters || []).map(
                              (chapter) => {
                                const isCompleted =
                                  completedChapters.has(
                                    chapter.id
                                  );

                                const isSelected =
                                  Number(
                                    selectedContent.chapterId
                                  ) ===
                                    Number(
                                      chapter.id
                                    ) &&
                                  Number(
                                    selectedContent.lectureId
                                  ) ===
                                    Number(
                                      lecture.id
                                    );

                                return (
                                  <div
                                    key={chapter.id}
                                    className={`${
                                      courseDetailStylesH.chapterItem
                                    } ${
                                      isSelected
                                        ? courseDetailStylesH.chapterItemSelected
                                        : courseDetailStylesH.chapterItemNormal
                                    }`}
                                    onClick={() =>
                                      handleContentSelect(
                                        lecture.id,
                                        chapter.id
                                      )
                                    }
                                    role="button"
                                    tabIndex={0}
                                    onKeyDown={(
                                      event
                                    ) => {
                                      if (
                                        event.key ===
                                          "Enter" ||
                                        event.key ===
                                          " "
                                      ) {
                                        event.preventDefault();

                                        handleContentSelect(
                                          lecture.id,
                                          chapter.id
                                        );
                                      }
                                    }}
                                  >
                                    <div
                                      className={
                                        courseDetailStylesH.chapterContent
                                      }
                                    >
                                      <div
                                        className={
                                          courseDetailStylesH.chapterLeft
                                        }
                                      >
                                        {/* Completion */}
                                        <button
                                          type="button"
                                          onClick={(
                                            event
                                          ) => {
                                            event.stopPropagation();

                                            toggleChapterCompletion(
                                              chapter.id,
                                              event
                                            );
                                          }}
                                          className={`${
                                            courseDetailStylesH.chapterCompletionButton
                                          } ${
                                            isCompleted
                                              ? courseDetailStylesH.chapterCompletionCompleted
                                              : courseDetailStylesH.chapterCompletionNormal
                                          }`}
                                          aria-label={
                                            isCompleted
                                              ? "Mark chapter as incomplete"
                                              : "Mark chapter as complete"
                                          }
                                        >
                                          {isCompleted ? (
                                            <CheckCircle className="w-5 h-5" />
                                          ) : (
                                            <Circle className="w-5 h-5" />
                                          )}
                                        </button>

                                        <div
                                          className={
                                            courseDetailStylesH.chapterInfo
                                          }
                                        >
                                          <div
                                            className={`${
                                              courseDetailStylesH.chapterName
                                            } ${
                                              isSelected
                                                ? courseDetailStylesH.chapterNameSelected
                                                : courseDetailStylesH.chapterNameNormal
                                            }`}
                                          >
                                            {chapter.name}
                                          </div>

                                          <div
                                            className={
                                              courseDetailStylesH.chapterTopic
                                            }
                                          >
                                            {chapter.topic}
                                          </div>
                                        </div>
                                      </div>

                                      <div className="flex items-center gap-3">
                                        <span
                                          className={
                                            courseDetailStylesH.chapterDuration
                                          }
                                        >
                                          {fmtMinutes(
                                            chapter.durationMin
                                          )}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                );
                              }
                            )}
                          </div>
                        )}
                      </div>
                    );
                  }
                )}
              </div>
            </div>

            {/* =================================================
                PRICING CARD
            ================================================= */}

            <div
              className={`${courseDetailStylesH.sidebarCard} ${animationDelaysH.delay200}`}
            >
              <div
                className={
                  courseDetailStylesH.pricingHeader
                }
              >
                <h5
                  className={
                    courseDetailStylesH.pricingTitle
                  }
                >
                  Pricing
                </h5>
              </div>

              <div
                className={
                  courseDetailStylesH.pricingAmount
                }
              >
                <div
                  className={
                    courseDetailStylesH.pricingCurrent
                  }
                >
                  {courseIsFree
                    ? "Free"
                    : salePrice != null
                    ? formatCurrency(salePrice)
                    : originalPrice != null
                    ? formatCurrency(originalPrice)
                    : "Free"}
                </div>

                {hasDiscount && (
                  <div
                    className={
                      courseDetailStylesH.pricingOriginal
                    }
                  >
                    {formatCurrency(originalPrice)}
                  </div>
                )}

                {hasDiscount && (
                  <div
                    className={
                      courseDetailStylesH.pricingDiscount
                    }
                  >
                    {Math.round(
                      ((originalPrice -
                        salePrice) /
                        originalPrice) *
                        100
                    )}
                    % off
                  </div>
                )}
              </div>

              <p
                className={
                  courseDetailStylesH.pricingDescription
                }
              >
                {courseIsFree
                  ? "Free access · Learn anytime"
                  : "One-time payment · Lifetime access · 30-day guarantee"}
              </p>

              {/* Enroll Button */}
              <div className="mt-6">
                {!courseIsFree && !isEnrolled ? (
                  <button
                    type="button"
                    onClick={handleEnroll}
                    disabled={isEnrolling}
                    className={
                      courseDetailStylesH.enrollButton
                    }
                  >
                    {isEnrolling ? (
                      <>
                        <div
                          className={
                            courseDetailStylesH.enrollSpinner
                          }
                        />

                        Enrolling...
                      </>
                    ) : (
                      <>
                        <Play
                          className={
                            courseDetailStylesH.enrollButtonIcon
                          }
                        />

                        Enroll Now

                        <span className="ml-auto opacity-80 group-hover:opacity-100">
                          <ArrowRight className="w-4 h-4" />
                        </span>
                      </>
                    )}
                  </button>
                ) : courseIsFree ? (
                  <button
                    type="button"
                    disabled
                    className={
                      courseDetailStylesH.enrollButtonFree
                    }
                  >
                    <CheckCircle
                      className={
                        courseDetailStylesH.enrollButtonIcon
                      }
                    />

                    Free Course - Access Granted
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled
                    className={
                      courseDetailStylesH.enrollButtonEnrolled
                    }
                  >
                    <CheckCircle
                      className={
                        courseDetailStylesH.enrollButtonIcon
                      }
                    />

                    Enrolled
                  </button>
                )}
              </div>
            </div>

            {/* =================================================
                PROGRESS CARD
            ================================================= */}

            <div
              className={`${courseDetailStylesH.sidebarCard} ${animationDelaysH.delay400}`}
            >
              <div
                className={
                  courseDetailStylesH.progressHeader
                }
              >
                <Award
                  className={
                    courseDetailStylesH.progressIcon
                  }
                />

                <h5
                  className={
                    courseDetailStylesH.progressTitle
                  }
                >
                  Your Progress
                </h5>
              </div>

              <div
                className={
                  courseDetailStylesH.progressSection
                }
              >
                {/* Progress */}
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">
                      Course Completion
                    </span>

                    <span className="font-semibold text-indigo-600">
                      {progressPercentage}%
                    </span>
                  </div>

                  <div
                    className={
                      courseDetailStylesH.progressBarContainer
                    }
                  >
                    <div
                      className={
                        courseDetailStylesH.progressBar
                      }
                      style={{
                        width: `${progressPercentage}%`,
                      }}
                    />
                  </div>
                </div>

                {/* Progress Stats */}
                <div
                  className={
                    courseDetailStylesH.progressStats
                  }
                >
                  <div
                    className={
                      courseDetailStylesH.progressStat
                    }
                  >
                    <div
                      className={
                        courseDetailStylesH.progressStatValue
                      }
                    >
                      {fmtMinutes(totalMinutes)}
                    </div>

                    <div
                      className={
                        courseDetailStylesH.progressStatLabel
                      }
                    >
                      Total Duration
                    </div>
                  </div>

                  <div
                    className={
                      courseDetailStylesH.progressStat
                    }
                  >
                    <div
                      className={
                        courseDetailStylesH.progressStatValue
                      }
                    >
                      {completedChapters.size}
                    </div>

                    <div
                      className={
                        courseDetailStylesH.progressStatLabel
                      }
                    >
                      Completed
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* =====================================================
          CUSTOM ANIMATIONS

          IMPORTANT:
          Use normal <style> instead of <style jsx>.
          <style jsx> requires styled-jsx and is not normally
          supported in a standard Vite React application.
      ===================================================== */}

      <style>
        {courseDetailCustomStyles}
      </style>
    </div>
  );
};

export default CourseDetail;
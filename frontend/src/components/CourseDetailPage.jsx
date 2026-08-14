import React, { useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import {
  Play,
  Clock,
  CheckCircle,
  Circle,
  Sparkles,
  ChevronDown,
  ArrowRight,
} from "lucide-react";

// ============================================================
// HELPERS
// ============================================================

const toEmbedUrl = (url) => {
  if (!url) return "";

  try {
    const trimmed = String(url).trim();

    if (!trimmed) return "";

    // Already an embed URL
    if (/\/embed\//i.test(trimmed)) {
      return trimmed;
    }

    // --------------------------------------------------------
    // YouTube Shorts
    // --------------------------------------------------------
    const shortsMatch = trimmed.match(
      /(?:https?:\/\/)?(?:www\.)?youtube\.com\/shorts\/([^?&#/]+)/
    );

    if (shortsMatch?.[1]) {
      return `https://www.youtube.com/embed/${shortsMatch[1]}`;
    }

    // --------------------------------------------------------
    // YouTube watch URL
    // Example:
    // https://www.youtube.com/watch?v=VIDEO_ID
    // --------------------------------------------------------
    const watchMatch = trimmed.match(/[?&]v=([^&#]+)/);

    if (watchMatch?.[1]) {
      return `https://www.youtube.com/embed/${watchMatch[1]}`;
    }

    // --------------------------------------------------------
    // YouTube short URL
    // Example:
    // https://youtu.be/VIDEO_ID
    // --------------------------------------------------------
    const shortMatch = trimmed.match(
      /(?:https?:\/\/)?youtu\.be\/([^?&#/]+)/
    );

    if (shortMatch?.[1]) {
      return `https://www.youtube.com/embed/${shortMatch[1]}`;
    }

    // --------------------------------------------------------
    // Google Drive
    // Example:
    // https://drive.google.com/file/d/FILE_ID/view
    // --------------------------------------------------------
    if (/drive\.google\.com/i.test(trimmed)) {
      const fileMatch = trimmed.match(/\/file\/d\/([^/]+)/);

      if (fileMatch?.[1]) {
        return `https://drive.google.com/file/d/${fileMatch[1]}/preview`;
      }

      const idMatch = trimmed.match(/[?&]id=([^&#]+)/);

      if (idMatch?.[1]) {
        return `https://drive.google.com/file/d/${idMatch[1]}/preview`;
      }
    }

    // --------------------------------------------------------
    // Direct video file
    // --------------------------------------------------------
    if (isDirectVideoFile(trimmed)) {
      return trimmed;
    }

    // --------------------------------------------------------
    // Raw YouTube ID fallback
    // --------------------------------------------------------
    const lastSegment = trimmed.split("/").filter(Boolean).pop();

    if (
      lastSegment &&
      lastSegment.length === 11 &&
      /^[a-zA-Z0-9_-]+$/.test(lastSegment)
    ) {
      return `https://www.youtube.com/embed/${lastSegment}`;
    }

    // Return original URL if nothing matched
    return trimmed;
  } catch (error) {
    console.error("Error converting video URL:", error);
    return String(url);
  }
};

const isDirectVideoFile = (url) => {
  if (!url) return false;

  return /\.(mp4|webm|ogg)(\?.*)?$/i.test(String(url));
};

const appendAutoplay = (url, canPlay) => {
  if (!url || !canPlay) return url;

  // Don't modify direct video files
  if (isDirectVideoFile(url)) {
    return url;
  }

  // YouTube
  if (/youtube\.com|youtu\.be/i.test(url)) {
    const separator = url.includes("?") ? "&" : "?";

    return `${url}${separator}autoplay=1`;
  }

  // Google Drive
  if (/drive\.google\.com/i.test(url)) {
    const separator = url.includes("?") ? "&" : "?";

    return `${url}${separator}autoplay=1`;
  }

  return url;
};

const fmtMinutes = (min) => {
  const minutes = Number(min) || 0;

  if (minutes <= 0) {
    return "0m";
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (hours > 0) {
    return `${hours}h ${remainingMinutes}m`;
  }

  return `${remainingMinutes}m`;
};

const formatCurrency = (amount) => {
  const numericAmount = Number(amount) || 0;

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(numericAmount);
};

// ============================================================
// COMPONENT
// ============================================================

const CourseDetail = ({
  coursesData = [],
  courseDetailStyles = {},
}) => {
  const { id } = useParams();

  // ----------------------------------------------------------
  // Course ID
  // ----------------------------------------------------------

  const courseId = Number.parseInt(id, 10);

  // ----------------------------------------------------------
  // STATE
  // ----------------------------------------------------------

  // Temporary login state.
  // Replace this with your real authentication state later.
  const [isLoggedIn] = useState(true);

  const [isEnrolled, setIsEnrolled] = useState(false);

  const [isEnrolling, setIsEnrolling] = useState(false);

  const [toast, setToast] = useState(null);

  const [expandedLectures, setExpandedLectures] = useState(
    new Set()
  );

  const [completedChapters, setCompletedChapters] = useState(
    new Set()
  );

  // Currently selected content
  const [selectedContent, setSelectedContent] = useState({
    type: null,
    lectureId: null,
    chapterId: null,
  });

  // ----------------------------------------------------------
  // FIND COURSE
  // ----------------------------------------------------------

  const course = useMemo(() => {
    if (!Array.isArray(coursesData)) {
      return null;
    }

    return coursesData.find((item) => {
      return Number(item?.id) === courseId;
    });
  }, [coursesData, courseId]);

  // ----------------------------------------------------------
  // COURSE PRICING
  // ----------------------------------------------------------

  const isCourseFree = useMemo(() => {
    if (!course) {
      return false;
    }

    return (
      course.isFree === true ||
      Number(course.price) === 0
    );
  }, [course]);

  const originalPrice = Number(course?.price) || 0;

  const salePrice =
    course?.salePrice !== undefined &&
    course?.salePrice !== null &&
    course?.salePrice !== ""
      ? Number(course.salePrice)
      : null;

  const hasDiscount =
    !isCourseFree &&
    salePrice !== null &&
    salePrice >= 0 &&
    salePrice < originalPrice;

  // ----------------------------------------------------------
  // SELECTED LECTURE
  // ----------------------------------------------------------

  const selectedLecture = useMemo(() => {
    if (!selectedContent.lectureId || !course?.lectures) {
      return null;
    }

    return (
      course.lectures.find(
        (lecture) =>
          Number(lecture.id) ===
          Number(selectedContent.lectureId)
      ) || null
    );
  }, [selectedContent.lectureId, course]);

  // ----------------------------------------------------------
  // CURRENT VIDEO CONTENT
  // ----------------------------------------------------------

  const currentVideoContent = useMemo(() => {
    if (!selectedLecture) {
      return null;
    }

    // Selected chapter
    if (
      selectedContent.type === "chapter" &&
      selectedContent.chapterId
    ) {
      return (
        selectedLecture.chapters?.find(
          (chapter) =>
            Number(chapter.id) ===
            Number(selectedContent.chapterId)
        ) || null
      );
    }

    // Selected lecture
    return selectedLecture;
  }, [selectedLecture, selectedContent]);

  // ----------------------------------------------------------
  // VIDEO URL
  // ----------------------------------------------------------

  const currentRawUrl =
    currentVideoContent?.videoUrl || null;

  const currentEmbedUrl = useMemo(() => {
    if (!currentRawUrl) {
      return null;
    }

    return toEmbedUrl(currentRawUrl);
  }, [currentRawUrl]);

  const currentIsDirectVideo =
    isDirectVideoFile(currentEmbedUrl);

  // ----------------------------------------------------------
  // ACCESS CHECK
  // ----------------------------------------------------------

  const canAccessCourse =
    isLoggedIn && (isCourseFree || isEnrolled);

  // ==========================================================
  // HANDLERS
  // ==========================================================

  // ----------------------------------------------------------
  // Lecture header click
  // ----------------------------------------------------------

  const onLectureHeaderClick = (lectureId) => {
    if (!isLoggedIn) {
      setToast({
        message:
          "Please login to access course content.",
        type: "error",
      });

      return;
    }

    if (!isCourseFree && !isEnrolled) {
      setToast({
        message:
          "Please enroll in the course to access content.",
        type: "error",
      });

      return;
    }

    // Select lecture as playable content
    setSelectedContent({
      type: "lecture",
      lectureId,
      chapterId: null,
    });

    // Expand/collapse lecture
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

  // ----------------------------------------------------------
  // Chapter selection
  // ----------------------------------------------------------

  const handleContentSelect = (
    lectureId,
    chapterId = null
  ) => {
    if (!isLoggedIn) {
      setToast({
        message:
          "Please login to access course content.",
        type: "error",
      });

      return;
    }

    if (isCourseFree || isEnrolled) {
      setSelectedContent({
        type: chapterId ? "chapter" : "lecture",
        lectureId,
        chapterId,
      });

      // Automatically expand selected lecture
      setExpandedLectures((previous) => {
        const next = new Set(previous);

        next.add(lectureId);

        return next;
      });

      return;
    }

    setToast({
      message:
        "Please enroll in the course to access this content.",
      type: "error",
    });
  };

  // ----------------------------------------------------------
  // Chapter completion
  // ----------------------------------------------------------

  const toggleChapterCompletion = (
    chapterId,
    event
  ) => {
    if (event) {
      event.stopPropagation();
    }

    if (!canAccessCourse) {
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

  // ----------------------------------------------------------
  // Enrollment
  // ----------------------------------------------------------

  const handleEnroll = () => {
    if (!isLoggedIn) {
      setToast({
        message:
          "Please login before enrolling in a course.",
        type: "error",
      });

      return;
    }

    if (isCourseFree) {
      setIsEnrolled(true);

      setToast({
        message: "You now have access to this course.",
        type: "success",
      });

      return;
    }

    setIsEnrolling(true);

    // --------------------------------------------------------
    // TEMPORARY SIMULATION
    //
    // Replace this with your backend API call.
    // --------------------------------------------------------

    setTimeout(() => {
      setIsEnrolled(true);
      setIsEnrolling(false);

      setToast({
        message: "Successfully enrolled!",
        type: "success",
      });
    }, 1000);
  };

  // ==========================================================
  // COURSE NOT FOUND
  // ==========================================================

  if (!course) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-xl font-semibold">
          Course not found.
        </h2>

        <p className="mt-2 text-gray-500">
          The course you are looking for does not exist.
        </p>
      </div>
    );
  }

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <div className={courseDetailStyles.container}>
      {/* =====================================================
          TOAST
      ====================================================== */}

      {toast && (
        <div className={`toast toast-${toast.type}`}>
          <span>{toast.message}</span>

          <button
            type="button"
            onClick={() => setToast(null)}
            aria-label="Close notification"
          >
            ✕
          </button>
        </div>
      )}

      {/* =====================================================
          MAIN CONTENT GRID
      ====================================================== */}

      <div className={courseDetailStyles.mainGrid}>
        {/* ===================================================
            VIDEO SECTION
        ==================================================== */}

        <div className={courseDetailStyles.videoSection}>
          <div className={courseDetailStyles.videoContainer}>
            {/* ------------------------------------------------
                VIDEO
            ------------------------------------------------- */}

            {currentEmbedUrl ? (
              currentIsDirectVideo ? (
                <video
                  controls
                  src={currentEmbedUrl}
                  className={courseDetailStyles.video}
                  title={
                    currentVideoContent?.title ||
                    currentVideoContent?.name ||
                    "Course video"
                  }
                >
                  Your browser does not support
                  video playback.
                </video>
              ) : (
                <iframe
                  title={
                    currentVideoContent?.title ||
                    currentVideoContent?.name ||
                    "video-player"
                  }
                  src={appendAutoplay(
                    currentEmbedUrl,
                    canAccessCourse
                  )}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className={courseDetailStyles.iframe}
                />
              )
            ) : (
              /* ------------------------------------------------
                 VIDEO PLACEHOLDER
              ------------------------------------------------- */

              <div
                className={
                  courseDetailStyles.videoPlaceholder
                }
              >
                <div
                  className={
                    courseDetailStyles.videoPlaceholderBg
                  }
                >
                  <div
                    className={
                      courseDetailStyles.videoPlaceholderOrb1
                    }
                  />

                  <div
                    className={
                      courseDetailStyles.videoPlaceholderOrb2
                    }
                  />
                </div>

                <div
                  className={
                    courseDetailStyles.videoPlaceholderContent
                  }
                >
                  <div
                    className={
                      courseDetailStyles.videoPlaceholderIcon
                    }
                  >
                    <Play
                      className={
                        courseDetailStyles.videoPlaceholderPlayIcon
                      }
                    />
                  </div>

                  <p
                    className={
                      courseDetailStyles.videoPlaceholderText
                    }
                  >
                    Select a lecture or chapter to play
                    video
                  </p>

                  {!canAccessCourse && (
                    <p
                      className={
                        courseDetailStyles.videoPlaceholderSubtext
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

            {/* =================================================
                VIDEO INFORMATION
            ================================================== */}

            <div className={courseDetailStyles.videoInfo}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3
                    className={
                      courseDetailStyles.videoTitle
                    }
                  >
                    {currentVideoContent?.title ||
                      currentVideoContent?.name ||
                      "Select content to play"}
                  </h3>

                  <p
                    className={
                      courseDetailStyles.videoDescription
                    }
                  >
                    {selectedContent.type === "chapter"
                      ? `Part of: ${
                          selectedLecture?.title || ""
                        }`
                      : currentVideoContent?.description ||
                        ""}
                  </p>

                  {/* -----------------------------------------
                      VIDEO META
                  ------------------------------------------ */}

                  {currentVideoContent?.durationMin !==
                    undefined &&
                    currentVideoContent?.durationMin !==
                      null && (
                      <div
                        className={
                          courseDetailStyles.videoMeta
                        }
                      >
                        <div
                          className={
                            courseDetailStyles.durationBadge
                          }
                        >
                          <Clock
                            className={
                              courseDetailStyles.durationIcon
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
                              courseDetailStyles.chapterBadge
                            }
                          >
                            Chapter
                          </span>
                        )}
                      </div>
                    )}
                </div>
              </div>

              {/* =================================================
                  CHAPTER COMPLETION
              ================================================== */}

              {canAccessCourse &&
                selectedContent.chapterId && (
                  <div
                    className={
                      courseDetailStyles.completionSection
                    }
                  >
                    <button
                      type="button"
                      onClick={(event) =>
                        toggleChapterCompletion(
                          selectedContent.chapterId,
                          event
                        )
                      }
                      className={`${
                        courseDetailStyles.completionButton
                      } ${
                        completedChapters.has(
                          selectedContent.chapterId
                        )
                          ? courseDetailStyles.completionButtonCompleted
                          : courseDetailStyles.completionButtonIncomplete
                      }`}
                    >
                      {completedChapters.has(
                        selectedContent.chapterId
                      ) ? (
                        <>
                          <CheckCircle
                            className={
                              courseDetailStyles.completionIcon
                            }
                          />

                          Chapter Completed
                        </>
                      ) : (
                        <>
                          <Circle
                            className={
                              courseDetailStyles.completionIcon
                            }
                          />

                          Mark as Complete
                        </>
                      )}
                    </button>
                  </div>
                )}
            </div>
          </div>
        </div>

        {/* ===================================================
            SIDEBAR
        ==================================================== */}

        <aside className={courseDetailStyles.sidebar}>
          {/* =================================================
              COURSE CONTENT
          ================================================== */}

          <div
            className={
              courseDetailStyles.contentCard
            }
          >
            <div
              className={
                courseDetailStyles.contentHeader
              }
            >
              <h4
                className={
                  courseDetailStyles.contentTitle
                }
              >
                Course Content
              </h4>

              {isCourseFree && (
                <div
                  className={
                    courseDetailStyles.freeBadge
                  }
                >
                  <Sparkles
                    className={
                      courseDetailStyles.freeBadgeIcon
                    }
                  />

                  Free Access
                </div>
              )}
            </div>

            {/* =================================================
                LECTURE LIST
            ================================================== */}

            <div
              className={
                courseDetailStyles.contentList
              }
            >
              {(Array.isArray(course.lectures)
                ? course.lectures
                : []
              ).map((lecture, index) => {
                const lectureId = lecture.id;

                const isExpanded =
                  expandedLectures.has(lectureId);

                return (
                  <div
                    key={lectureId}
                    className={
                      courseDetailStyles.lectureItem
                    }
                    style={{
                      animationDelay: `${
                        index * 100
                      }ms`,
                    }}
                  >
                    {/* =========================================
                        LECTURE HEADER
                    ========================================== */}

                    <div
                      className={`${
                        courseDetailStyles.lectureHeader
                      } ${
                        isExpanded
                          ? courseDetailStyles.lectureHeaderExpanded
                          : courseDetailStyles.lectureHeaderCollapsed
                      }`}
                      onClick={() =>
                        onLectureHeaderClick(lectureId)
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
                          courseDetailStyles.lectureHeaderContent
                        }
                      >
                        <div
                          className={
                            courseDetailStyles.lectureLeftSection
                          }
                        >
                          <div
                            className={`${
                              courseDetailStyles.lectureChevron
                            } ${
                              isExpanded
                                ? courseDetailStyles.lectureChevronExpanded
                                : courseDetailStyles.lectureChevronCollapsed
                            }`}
                          >
                            <ChevronDown className="w-5 h-5" />
                          </div>

                          <div
                            className={
                              courseDetailStyles.lectureInfo
                            }
                          >
                            <div
                              className={
                                courseDetailStyles.lectureTitle
                              }
                            >
                              {lecture.title ||
                                `Lecture ${
                                  index + 1
                                }`}
                            </div>

                            <div
                              className={
                                courseDetailStyles.lectureMeta
                              }
                            >
                              <div
                                className={
                                  courseDetailStyles.lectureDuration
                                }
                              >
                                <Clock className="w-4 h-4" />

                                {fmtMinutes(
                                  lecture.durationMin
                                )}
                              </div>

                              <span
                                className={
                                  courseDetailStyles.lectureChapterCount
                                }
                              >
                                {Array.isArray(
                                  lecture.chapters
                                )
                                  ? lecture.chapters
                                      .length
                                  : 0}{" "}
                                chapters
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* =========================================
                        CHAPTER LIST
                    ========================================== */}

                    {isExpanded && (
                      <div
                        className={
                          courseDetailStyles.chapterList
                        }
                      >
                        {(Array.isArray(
                          lecture.chapters
                        )
                          ? lecture.chapters
                          : []
                        ).map((chapter) => {
                          const isCompleted =
                            completedChapters.has(
                              chapter.id
                            );

                          const isSelected =
                            selectedContent.chapterId ===
                              chapter.id &&
                            selectedContent.lectureId ===
                              lecture.id;

                          const isDisabled =
                            !isCourseFree &&
                            !isEnrolled;

                          return (
                            <div
                              key={chapter.id}
                              className={`${
                                courseDetailStyles.chapterItem
                              } ${
                                isSelected
                                  ? courseDetailStyles.chapterSelected
                                  : courseDetailStyles.chapterNotSelected
                              } ${
                                isDisabled
                                  ? courseDetailStyles.chapterDisabled
                                  : ""
                              }`}
                              onClick={() =>
                                handleContentSelect(
                                  lecture.id,
                                  chapter.id
                                )
                              }
                              role="button"
                              tabIndex={0}
                              onKeyDown={(event) => {
                                if (
                                  event.key ===
                                    "Enter" ||
                                  event.key === " "
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
                                  courseDetailStyles.chapterContent
                                }
                              >
                                <div
                                  className={
                                    courseDetailStyles.chapterLeftSection
                                  }
                                >
                                  {/* ---------------------------------
                                      COMPLETION BUTTON
                                  ---------------------------------- */}

                                  <button
                                    type="button"
                                    onClick={(event) => {
                                      event.stopPropagation();

                                      if (
                                        isCourseFree ||
                                        isEnrolled
                                      ) {
                                        toggleChapterCompletion(
                                          chapter.id,
                                          event
                                        );
                                      }
                                    }}
                                    className={`${
                                      courseDetailStyles.completionToggle
                                    } ${
                                      isCompleted
                                        ? courseDetailStyles.completionToggleCompleted
                                        : courseDetailStyles.completionToggleIncomplete
                                    }`}
                                    disabled={
                                      isDisabled
                                    }
                                    aria-label={
                                      isCompleted
                                        ? "Mark chapter as incomplete"
                                        : "Mark chapter as complete"
                                    }
                                  >
                                    {isCompleted ? (
                                      <CheckCircle
                                        className={
                                          courseDetailStyles.completionIconSmall
                                        }
                                      />
                                    ) : (
                                      <Circle
                                        className={
                                          courseDetailStyles.completionIconSmall
                                        }
                                      />
                                    )}
                                  </button>

                                  {/* ---------------------------------
                                      CHAPTER TEXT
                                  ---------------------------------- */}

                                  <div
                                    className={
                                      courseDetailStyles.chapterText
                                    }
                                  >
                                    <div
                                      className={`${
                                        courseDetailStyles.chapterName
                                      } ${
                                        isSelected
                                          ? courseDetailStyles.chapterNameSelected
                                          : courseDetailStyles.chapterNameNotSelected
                                      }`}
                                    >
                                      {chapter.name ||
                                        chapter.title ||
                                        "Untitled Chapter"}
                                    </div>

                                    {chapter.topic && (
                                      <div
                                        className={
                                          courseDetailStyles.chapterTopic
                                        }
                                      >
                                        {chapter.topic}
                                      </div>
                                    )}
                                  </div>
                                </div>

                                {/* ---------------------------------
                                    CHAPTER DURATION
                                ---------------------------------- */}

                                <span
                                  className={
                                    courseDetailStyles.chapterDuration
                                  }
                                >
                                  {fmtMinutes(
                                    chapter.durationMin
                                  )}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* =================================================
              PRICING CARD
          ================================================== */}

          <div
            className={`${courseDetailStyles.pricingCard} animation-delay-200`}
          >
            <div
              className={
                courseDetailStyles.pricingHeader
              }
            >
              <h5
                className={
                  courseDetailStyles.pricingTitle
                }
              >
                Pricing
              </h5>
            </div>

            <div
              className={
                courseDetailStyles.pricingAmount
              }
            >
              {/* ---------------------------------------------
                  CURRENT PRICE
              ---------------------------------------------- */}

              <div
                className={
                  courseDetailStyles.price
                }
              >
                {isCourseFree
                  ? "Free"
                  : hasDiscount
                  ? formatCurrency(salePrice)
                  : formatCurrency(originalPrice)}
              </div>

              {/* ---------------------------------------------
                  ORIGINAL PRICE + DISCOUNT
              ---------------------------------------------- */}

              {!isCourseFree && hasDiscount && (
                <>
                  <div
                    className={
                      courseDetailStyles.originalPrice
                    }
                  >
                    {formatCurrency(originalPrice)}
                  </div>

                  <div
                    className={
                      courseDetailStyles.discountBadge
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
                </>
              )}
            </div>

            {/* =================================================
                DESCRIPTION
            ================================================== */}

            <p
              className={
                courseDetailStyles.pricingDescription
              }
            >
              {isCourseFree
                ? "Free access · Learn anytime"
                : "One-time payment · Lifetime access"}
            </p>

            {/* =================================================
                ENROLLMENT BUTTON
            ================================================== */}

            <div className="mt-6">
              {/* ---------------------------------------------
                  FREE COURSE
              ---------------------------------------------- */}

              {isCourseFree ? (
                <button
                  type="button"
                  disabled
                  className={`${courseDetailStyles.enrollButton} ${courseDetailStyles.freeEnrolledButton}`}
                >
                  <CheckCircle
                    className={
                      courseDetailStyles.enrollIcon
                    }
                  />

                  Free Course - Access Granted
                </button>
              ) : !isEnrolled ? (
                /* -------------------------------------------
                   PAID COURSE - NOT ENROLLED
                -------------------------------------------- */

                <button
                  type="button"
                  onClick={handleEnroll}
                  disabled={isEnrolling}
                  className={`${courseDetailStyles.enrollButton} ${courseDetailStyles.enrollPaidButton}`}
                >
                  {isEnrolling ? (
                    <>
                      <div
                        className={
                          courseDetailStyles.enrollSpinner
                        }
                      />

                      Enrolling...
                    </>
                  ) : (
                    <>
                      <Play
                        className={
                          courseDetailStyles.enrollIcon
                        }
                      />

                      Enroll Now

                      <ArrowRight />
                    </>
                  )}
                </button>
              ) : (
                /* -------------------------------------------
                   PAID COURSE - ALREADY ENROLLED
                -------------------------------------------- */

                <button
                  type="button"
                  disabled
                  className={`${courseDetailStyles.enrollButton} ${courseDetailStyles.freeEnrolledButton}`}
                >
                  <CheckCircle
                    className={
                      courseDetailStyles.enrollIcon
                    }
                  />

                  Enrolled
                </button>
              )}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default CourseDetail;
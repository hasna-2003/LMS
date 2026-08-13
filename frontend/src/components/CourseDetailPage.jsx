import React, { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Play,
  Clock,
  CheckCircle,
  Circle,
  Sparkles,
  ChevronDown,
  ArrowRight,
} from "lucide-react";

// --- Helpers --- //
const toEmbedUrl = (url) => {
  if (!url) return "";
  try {
    const trimmed = String(url).trim();
    if (/\/embed\//.test(trimmed)) return trimmed;

    // YouTube Shorts
    const shortsMatch = trimmed.match(/youtube\.com\/shorts\/([^?&#/]+)/);
    if (shortsMatch && shortsMatch[1]) {
      return `https://www.youtube.com/embed/${shortsMatch[1]}`;
    }

    // YouTube watch?v=
    const watchMatch = trimmed.match(/[?&]v=([^&#]+)/);
    if (watchMatch && watchMatch[1]) {
      return `https://www.youtube.com/embed/${watchMatch[1]}`;
    }

    // YouTube short domain youtu.be/
    const shortMatch = trimmed.match(/youtu\.be\/([^?&#/]+)/);
    if (shortMatch && shortMatch[1]) {
      return `https://www.youtube.com/embed/${shortMatch[1]}`;
    }

    // Google Drive
    if (/drive\.google\.com/.test(trimmed)) {
      const fileMatch = trimmed.match(/\/file\/d\/([^/]+)/);
      if (fileMatch && fileMatch[1]) {
        return `https://drive.google.com/file/d/${fileMatch[1]}/preview`;
      }
      const idMatch = trimmed.match(/[?&]id=([^&#]+)/);
      if (idMatch && idMatch[1]) {
        return `https://drive.google.com/file/d/${idMatch[1]}/preview`;
      }
    }

    // Raw 11-char ID fallback
    const lastSeg = trimmed.split("/").filter(Boolean).pop();
    if (lastSeg && lastSeg.length === 11 && /^[a-zA-Z0-9_-]+$/.test(lastSeg)) {
      return `https://www.youtube.com/embed/${lastSeg}`;
    }

    return trimmed;
  } catch (e) {
    return url;
  }
};

const isDirectVideoFile = (url) => {
  if (!url) return false;
  return /\.(mp4|webm|ogg)(\?.*)?$/i.test(url);
};

const appendAutoplay = (url, canPlay) => {
  if (!url || !canPlay) return url;
  const separator = url.includes("?") ? "&" : "?";
  return `${url}${separator}autoplay=1`;
};

const fmtMinutes = (min) => {
  if (!min) return "0m";
  const h = Math.floor(min / 60);
  const m = min % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
};

const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
    amount
  );

// --- Component --- //
const CourseDetail = ({ coursesData = [], courseDetailStyles = {} }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const courseId = parseInt(id, 10);

  const [isLoggedIn] = useState(true);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [isEnrolling, setIsEnrolling] = useState(false);

  const [toast, setToast] = useState(null);
  const [expandedLectures, setExpandedLectures] = useState(new Set());
  const [completedChapters, setCompletedChapters] = useState(new Set());

  // Track currently selected video target
  const [selectedContent, setSelectedContent] = useState({
    type: null, // "lecture" | "chapter"
    lectureId: null,
    chapterId: null,
  });

  const course = useMemo(
    () => coursesData.find((c) => c.id === courseId),
    [coursesData, courseId]
  );

  const isCourseFree = course?.isFree || !course?.price;
  const originalPrice = course?.price || 0;
  const salePrice = course?.salePrice ?? null;
  const hasDiscount = salePrice != null && salePrice < originalPrice;

  // Resolve active lecture object
  const selectedLecture = useMemo(() => {
    if (!selectedContent.lectureId || !course?.lectures) return null;
    return course.lectures.find((l) => l.id === selectedContent.lectureId);
  }, [selectedContent.lectureId, course]);

  // Resolve active playable item (lecture or specific chapter)
  const currentVideoContent = useMemo(() => {
    if (!selectedLecture) return null;
    if (selectedContent.type === "chapter" && selectedContent.chapterId) {
      return (
        selectedLecture.chapters?.find(
          (ch) => ch.id === selectedContent.chapterId
        ) || null
      );
    }
    return selectedLecture;
  }, [selectedLecture, selectedContent]);

  // Derive Embed URL
  const currentRawUrl = currentVideoContent?.videoUrl || null;
  const currentEmbedUrl = useMemo(
    () => (currentRawUrl ? toEmbedUrl(currentRawUrl) : null),
    [currentRawUrl]
  );
  const currentIsDirectVideo = isDirectVideoFile(currentEmbedUrl);

  // --- Handlers --- //
  const onLectureHeaderClick = (lectureId) => {
    if (!isLoggedIn) {
      setToast({ message: "Please login to access course content", type: "error" });
      return;
    }
    if (!isCourseFree && !isEnrolled) {
      setToast({ message: "Please enroll in the course to access content", type: "error" });
      return;
    }
    setExpandedLectures((prev) => {
      const next = new Set(prev);
      if (next.has(lectureId)) next.delete(lectureId);
      else next.add(lectureId);
      return next;
    });
  };

  const handleContentSelect = (lectureId, chapterId = null) => {
    if (!isLoggedIn) {
      setToast({ message: "Please login to access course content", type: "error" });
      return;
    }

    if (isCourseFree || isEnrolled) {
      setSelectedContent({
        type: chapterId ? "chapter" : "lecture",
        lectureId,
        chapterId,
      });

      setExpandedLectures((prev) => {
        const next = new Set(prev);
        next.add(lectureId);
        return next;
      });
      return;
    }

    setToast({
      message: "Please enroll in the course to access this content",
      type: "error",
    });
  };

  const toggleChapterCompletion = (chapterId, e) => {
    if (e) e.stopPropagation();
    setCompletedChapters((prev) => {
      const next = new Set(prev);
      if (next.has(chapterId)) next.delete(chapterId);
      else next.add(chapterId);
      return next;
    });
  };

  const handleEnroll = async () => {
    setIsEnrolling(true);
    // Simulate enrollment API call
    setTimeout(() => {
      setIsEnrolled(true);
      setIsEnrolling(false);
      setToast({ message: "Successfully enrolled!", type: "success" });
    }, 1000);
  };

  if (!course) {
    return <div className="p-8 text-center">Course not found.</div>;
  }

  return (
    <div className={courseDetailStyles.container}>
      {toast && (
        <div className={`toast toast-${toast.type}`}>
          {toast.message}
          <button onClick={() => setToast(null)}>✕</button>
        </div>
      )}

      {/* Main Content Grid */}
      <div className={courseDetailStyles.mainGrid}>
        {/* Video Section */}
        <div className={courseDetailStyles.videoSection}>
          <div className={courseDetailStyles.videoContainer}>
            {currentEmbedUrl ? (
              currentIsDirectVideo ? (
                <video
                  controls
                  src={currentEmbedUrl}
                  className={courseDetailStyles.video}
                />
              ) : (
                <iframe
                  title={
                    currentVideoContent?.title ||
                    currentVideoContent?.name ||
                    "video-player"
                  }
                  src={appendAutoplay(
                    currentEmbedUrl,
                    isLoggedIn && (isEnrolled || isCourseFree)
                  )}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className={courseDetailStyles.iframe}
                />
              )
            ) : (
              <div className={courseDetailStyles.videoPlaceholder}>
                <div className={courseDetailStyles.videoPlaceholderBg}>
                  <div className={courseDetailStyles.videoPlaceholderOrb1} />
                  <div className={courseDetailStyles.videoPlaceholderOrb2} />
                </div>
                <div className={courseDetailStyles.videoPlaceholderContent}>
                  <div className={courseDetailStyles.videoPlaceholderIcon}>
                    <Play className={courseDetailStyles.videoPlaceholderPlayIcon} />
                  </div>
                  <p className={courseDetailStyles.videoPlaceholderText}>
                    Select a lecture or chapter to play video
                  </p>
                  {(!isLoggedIn || (!isEnrolled && !isCourseFree)) && (
                    <p className={courseDetailStyles.videoPlaceholderSubtext}>
                      {!isLoggedIn ? "Login required" : "Enrollment required"}
                    </p>
                  )}
                </div>
              </div>
            )}

            <div className={courseDetailStyles.videoInfo}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className={courseDetailStyles.videoTitle}>
                    {currentVideoContent?.title ||
                      currentVideoContent?.name ||
                      "Select content to play"}
                  </h3>
                  <p className={courseDetailStyles.videoDescription}>
                    {selectedContent.type === "chapter"
                      ? `Part of: ${selectedLecture?.title || ""}`
                      : currentVideoContent?.description}
                  </p>
                  {currentVideoContent?.durationMin && (
                    <div className={courseDetailStyles.videoMeta}>
                      <div className={courseDetailStyles.durationBadge}>
                        <Clock className={courseDetailStyles.durationIcon} />
                        <span>{fmtMinutes(currentVideoContent.durationMin)}</span>
                      </div>
                      {selectedContent.type === "chapter" && (
                        <span className={courseDetailStyles.chapterBadge}>
                          Chapter
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {isLoggedIn &&
                (isEnrolled || isCourseFree) &&
                selectedContent.chapterId && (
                  <div className={courseDetailStyles.completionSection}>
                    <button
                      onClick={(e) =>
                        toggleChapterCompletion(selectedContent.chapterId, e)
                      }
                      className={`${courseDetailStyles.completionButton} ${
                        completedChapters.has(selectedContent.chapterId)
                          ? courseDetailStyles.completionButtonCompleted
                          : courseDetailStyles.completionButtonIncomplete
                      }`}
                    >
                      {completedChapters.has(selectedContent.chapterId) ? (
                        <>
                          <CheckCircle className={courseDetailStyles.completionIcon} />
                          Chapter Completed
                        </>
                      ) : (
                        <>
                          <Circle className={courseDetailStyles.completionIcon} />
                          Mark as Complete
                        </>
                      )}
                    </button>
                  </div>
                )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <aside className={courseDetailStyles.sidebar}>
          <div className={courseDetailStyles.contentCard}>
            <div className={courseDetailStyles.contentHeader}>
              <h4 className={courseDetailStyles.contentTitle}>Course Content</h4>
              {isCourseFree && (
                <div className={courseDetailStyles.freeBadge}>
                  <Sparkles className={courseDetailStyles.freeBadgeIcon} />
                  Free Access
                </div>
              )}
            </div>

            <div className={courseDetailStyles.contentList}>
              {(course.lectures || []).map((lecture, index) => (
                <div
                  key={lecture.id}
                  className={courseDetailStyles.lectureItem}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div
                    className={`${courseDetailStyles.lectureHeader} ${
                      expandedLectures.has(lecture.id)
                        ? courseDetailStyles.lectureHeaderExpanded
                        : courseDetailStyles.lectureHeaderCollapsed
                    }`}
                    onClick={() => onLectureHeaderClick(lecture.id)}
                  >
                    <div className={courseDetailStyles.lectureHeaderContent}>
                      <div className={courseDetailStyles.lectureLeftSection}>
                        <div
                          className={`${courseDetailStyles.lectureChevron} ${
                            expandedLectures.has(lecture.id)
                              ? courseDetailStyles.lectureChevronExpanded
                              : courseDetailStyles.lectureChevronCollapsed
                          }`}
                        >
                          <ChevronDown className="w-5 h-5" />
                        </div>
                        <div className={courseDetailStyles.lectureInfo}>
                          <div className={courseDetailStyles.lectureTitle}>
                            {lecture.title}
                          </div>
                          <div className={courseDetailStyles.lectureMeta}>
                            <div className={courseDetailStyles.lectureDuration}>
                              <Clock className="w-4 h-4" />
                              {fmtMinutes(lecture.durationMin)}
                            </div>
                            <span className={courseDetailStyles.lectureChapterCount}>
                              {lecture.chapters?.length || 0} chapters
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {expandedLectures.has(lecture.id) && (
                    <div className={courseDetailStyles.chapterList}>
                      {(lecture.chapters || []).map((chapter) => {
                        const isCompleted = completedChapters.has(chapter.id);
                        const isSelected =
                          selectedContent.chapterId === chapter.id &&
                          selectedContent.lectureId === lecture.id;

                        return (
                          <div
                            key={chapter.id}
                            className={`${courseDetailStyles.chapterItem} ${
                              isSelected
                                ? courseDetailStyles.chapterSelected
                                : courseDetailStyles.chapterNotSelected
                            } ${
                              !isCourseFree && !isEnrolled
                                ? courseDetailStyles.chapterDisabled
                                : ""
                            }`}
                            onClick={() =>
                              handleContentSelect(lecture.id, chapter.id)
                            }
                          >
                            <div className={courseDetailStyles.chapterContent}>
                              <div className={courseDetailStyles.chapterLeftSection}>
                                <button
                                  onClick={(e) => {
                                    if (isCourseFree || isEnrolled) {
                                      toggleChapterCompletion(chapter.id, e);
                                    }
                                  }}
                                  className={`${
                                    courseDetailStyles.completionToggle
                                  } ${
                                    isCompleted
                                      ? courseDetailStyles.completionToggleCompleted
                                      : courseDetailStyles.completionToggleIncomplete
                                  }`}
                                  disabled={!isCourseFree && !isEnrolled}
                                >
                                  {isCompleted ? (
                                    <CheckCircle
                                      className={courseDetailStyles.completionIconSmall}
                                    />
                                  ) : (
                                    <Circle
                                      className={courseDetailStyles.completionIconSmall}
                                    />
                                  )}
                                </button>
                                <div className={courseDetailStyles.chapterText}>
                                  <div
                                    className={`${courseDetailStyles.chapterName} ${
                                      isSelected
                                        ? courseDetailStyles.chapterNameSelected
                                        : courseDetailStyles.chapterNameNotSelected
                                    }`}
                                  >
                                    {chapter.name}
                                  </div>
                                  <div className={courseDetailStyles.chapterTopic}>
                                    {chapter.topic}
                                  </div>
                                </div>
                              </div>
                              <span className={courseDetailStyles.chapterDuration}>
                                {fmtMinutes(chapter.durationMin)}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Pricing Card */}
          <div className={`${courseDetailStyles.pricingCard} animation-delay-200`}>
            <div className={courseDetailStyles.pricingHeader}>
              <h5 className={courseDetailStyles.pricingTitle}>Pricing</h5>
            </div>

            <div className={courseDetailStyles.pricingAmount}>
              <div className={courseDetailStyles.price}>
                {isCourseFree
                  ? "Free"
                  : salePrice != null
                  ? formatCurrency(salePrice)
                  : formatCurrency(originalPrice)}
              </div>

              {!isCourseFree && hasDiscount && (
                <>
                  <div className={courseDetailStyles.originalPrice}>
                    {formatCurrency(originalPrice)}
                  </div>
                  <div className={courseDetailStyles.discountBadge}>
                    {Math.round(
                      ((originalPrice - salePrice) / originalPrice) * 100
                    )}
                    % off
                  </div>
                </>
              )}
            </div>

            <p className={courseDetailStyles.pricingDescription}>
              {isCourseFree
                ? "Free access · Learn anytime"
                : "One-time payment · Lifetime access"}
            </p>

            <div className="mt-6">
              {isCourseFree ? (
                <button
                  disabled
                  className={`${courseDetailStyles.enrollButton} ${courseDetailStyles.freeEnrolledButton}`}
                >
                  <CheckCircle className={courseDetailStyles.enrollIcon} />
                  Free Course - Access Granted
                </button>
              ) : !isEnrolled ? (
                <button
                  onClick={handleEnroll}
                  disabled={isEnrolling}
                  className={`${courseDetailStyles.enrollButton} ${courseDetailStyles.enrollPaidButton}`}
                >
                  {isEnrolling ? (
                    <>
                      <div className={courseDetailStyles.enrollSpinner} />
                      Enrolling...
                    </>
                  ) : (
                    <>
                      <Play className={courseDetailStyles.enrollIcon} />
                      Enroll Now
                      <ArrowRight />
                    </>
                  )}
                </button>
              ) : (
                <button
                  disabled
                  className={`${courseDetailStyles.enrollButton} ${courseDetailStyles.freeEnrolledButton}`}
                >
                  <CheckCircle className={courseDetailStyles.enrollIcon} />
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
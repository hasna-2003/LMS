import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BookOpen,
  CheckCircle,
  Clock,
  PlayCircle,
  Award,
  Search,
  ArrowRight,
  TrendingUp,
} from "lucide-react";

// Mock Enrolled Courses Data
const enrolledCoursesData = [
  {
    id: "1",
    title: "Full-Stack Web Development Bootcamp",
    instructor: "Dr. Sarah Jenkins",
    thumbnail:
      "https://images.unsplash.com/photo-1587620962725-abab7fe55159?auto=format&fit=crop&q=80&w=600",
    totalLessons: 45,
    completedLessons: 32,
    lastAccessed: "2 days ago",
    nextLesson: "Lesson 33: State Management with Redux Toolkit",
    status: "in-progress", // "in-progress" | "completed"
    category: "Development",
  },
  {
    id: "2",
    title: "Mastering UI/UX & Figma Design Systems",
    instructor: "Marcus Vance",
    thumbnail:
      "https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?auto=format&fit=crop&q=80&w=600",
    totalLessons: 28,
    completedLessons: 28,
    lastAccessed: "1 week ago",
    nextLesson: "Course Completed 🎉",
    status: "completed",
    category: "Design",
  },
  {
    id: "3",
    title: "Python for Data Science & Machine Learning",
    instructor: "Elena Rostova",
    thumbnail:
      "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=600",
    totalLessons: 52,
    completedLessons: 12,
    lastAccessed: "Yesterday",
    nextLesson: "Lesson 13: Introduction to Pandas DataFrames",
    status: "in-progress",
    category: "Data Science",
  },
  {
    id: "4",
    title: "Modern DevOps & Cloud Infrastructure with AWS",
    instructor: "David Kim",
    thumbnail:
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=600",
    totalLessons: 30,
    completedLessons: 30,
    lastAccessed: "3 weeks ago",
    nextLesson: "Course Completed 🎉",
    status: "completed",
    category: "DevOps",
  },
];

const MyCourse = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("all"); // "all" | "in-progress" | "completed"
  const [searchQuery, setSearchQuery] = useState("");

  // Calculate overall stats
  const totalEnrolled = enrolledCoursesData.length;
  const completedCount = enrolledCoursesData.filter(
    (c) => c.status === "completed"
  ).length;
  const inProgressCount = totalEnrolled - completedCount;

  // Filter courses based on selected tab and search input
  const filteredCourses = enrolledCoursesData.filter((course) => {
    const matchesTab =
      activeTab === "all" || course.status === activeTab;
    const matchesSearch =
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.instructor.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              My Learning Dashboard
            </h1>
            <p className="text-slate-600 text-sm sm:text-base mt-1">
              Track your course progress and pick up right where you left off.
            </p>
          </div>

          <button
            onClick={() => navigate("/courses")}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-md transition-all self-start md:self-auto"
          >
            <BookOpen className="w-4 h-4" />
            <span>Explore More Courses</span>
          </button>
        </div>

        {/* Dashboard Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
            <div className="p-3.5 rounded-xl bg-indigo-50 text-indigo-600">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-extrabold text-slate-900">
                {totalEnrolled}
              </p>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Enrolled Courses
              </p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
            <div className="p-3.5 rounded-xl bg-amber-50 text-amber-600">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-extrabold text-slate-900">
                {inProgressCount}
              </p>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                In Progress
              </p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
            <div className="p-3.5 rounded-xl bg-emerald-50 text-emerald-600">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-extrabold text-slate-900">
                {completedCount}
              </p>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Completed Courses
              </p>
            </div>
          </div>
        </div>

        {/* Toolbar: Filter Tabs & Search Bar */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between pt-4">
          {/* Tabs */}
          <div className="flex bg-slate-200/70 p-1 rounded-xl w-full sm:w-auto">
            <button
              onClick={() => setActiveTab("all")}
              className={`flex-1 sm:flex-initial px-5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                activeTab === "all"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              All Courses ({totalEnrolled})
            </button>
            <button
              onClick={() => setActiveTab("in-progress")}
              className={`flex-1 sm:flex-initial px-5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                activeTab === "in-progress"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              In Progress ({inProgressCount})
            </button>
            <button
              onClick={() => setActiveTab("completed")}
              className={`flex-1 sm:flex-initial px-5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                activeTab === "completed"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Completed ({completedCount})
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search my courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            />
          </div>
        </div>

        {/* Courses List */}
        {filteredCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredCourses.map((course) => {
              const progressPercentage = Math.round(
                (course.completedLessons / course.totalLessons) * 100
              );
              const isCompleted = course.status === "completed";

              return (
                <div
                  key={course.id}
                  className="bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col sm:flex-row"
                >
                  {/* Thumbnail */}
                  <div className="relative sm:w-48 h-48 sm:h-auto shrink-0 bg-slate-100 overflow-hidden">
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider">
                      {course.category}
                    </span>
                  </div>

                  {/* Course Details */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="text-xs font-medium text-slate-500">
                          Instructor: {course.instructor}
                        </span>
                        {isCompleted && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                            <CheckCircle className="w-3.5 h-3.5" /> Done
                          </span>
                        )}
                      </div>

                      <h3 className="text-base font-bold text-slate-900 leading-snug line-clamp-2">
                        {course.title}
                      </h3>

                      {/* Next Up Lesson Preview */}
                      <p className="mt-2 text-xs text-slate-500 line-clamp-1">
                        <span className="font-semibold text-slate-700">Next: </span>
                        {course.nextLesson}
                      </p>
                    </div>

                    {/* Progress Bar & Actions */}
                    <div className="mt-5 space-y-3">
                      <div>
                        <div className="flex justify-between items-center text-xs font-semibold mb-1.5">
                          <span className="text-slate-600">
                            {course.completedLessons} of {course.totalLessons} Lessons ({progressPercentage}%)
                          </span>
                          <span className="text-slate-400 font-normal">
                            {course.lastAccessed}
                          </span>
                        </div>
                        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                          <div
                            className={`h-full transition-all duration-500 ${
                              isCompleted ? "bg-emerald-500" : "bg-indigo-600"
                            }`}
                            style={{ width: `${progressPercentage}%` }}
                          />
                        </div>
                      </div>

                      {/* Action Button */}
                      <div className="pt-2 flex items-center justify-between gap-2">
                        {isCompleted ? (
                          <button
                            onClick={() => navigate(`/course/${course.id}/certificate`)}
                            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-semibold text-xs rounded-xl transition-all"
                          >
                            <Award className="w-4 h-4" />
                            <span>View Certificate</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => navigate(`/course/${course.id}/learn`)}
                            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl shadow-sm transition-all"
                          >
                            <PlayCircle className="w-4 h-4" />
                            <span>Continue Learning</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Empty State */
          <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-slate-200">
            <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-800">No courses found</h3>
            <p className="text-sm text-slate-500 max-w-sm mx-auto mt-1 mb-6">
              {searchQuery
                ? `No courses matching "${searchQuery}".`
                : "You haven't enrolled in any courses in this category yet."}
            </p>
            <button
              onClick={() => {
                setActiveTab("all");
                setSearchQuery("");
              }}
              className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-all"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyCourse;
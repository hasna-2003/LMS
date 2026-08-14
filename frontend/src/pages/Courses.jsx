import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import coursesData from "../assets/dummyData";

const API_BASE = "http://localhost:4000";
import {
  Search,
  Star,
  User,
  Clock,
  BookOpen,
  ArrowRight,
  Filter,
  X,
  Sparkles,
} from "lucide-react";

const Courses = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [backendCourses, setBackendCourses] = useState([]);

  useEffect(() => {
    const loadCourses = async () => {
      try {
        const response = await fetch(`${API_BASE}/api/course`);
        const data = await response.json();

        if (response.ok && data.success && Array.isArray(data.courses)) {
          setBackendCourses(data.courses);
        }
      } catch (error) {
        console.error("Failed to load courses from backend:", error);
      }
    };

    loadCourses();
  }, []);

  // Normalize courses array to handle diverse export formats safely
  const coursesList = useMemo(() => {
    if (backendCourses.length > 0) {
      return backendCourses.map((course) => ({
        id: course._id,
        name: course.name,
        teacher: course.teacher,
        category: course.category,
        image: course.image,
        overview: course.overview,
        price: course.price,
        isFree: course.pricingType === "free",
        students: course.totalLectures,
        rating: course.avgRating ?? 4.8,
      }));
    }

    if (Array.isArray(coursesData)) return coursesData;
    if (Array.isArray(coursesData?.dummyCourses)) return coursesData.dummyCourses;
    if (Array.isArray(coursesData?.courses)) return coursesData.courses;
    return [];
  }, [backendCourses]);

  // Extract unique categories dynamically
  const categories = useMemo(() => {
    const set = new Set(
      coursesList.map((c) => c.category).filter(Boolean)
    );
    return ["All", ...Array.from(set)];
  }, [coursesList]);

  // Filter courses by search query and selected category
  const filteredCourses = useMemo(() => {
    return coursesList.filter((course) => {
      const matchesSearch =
        course.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.teacher?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.category?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === "All" || course.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [coursesList, searchQuery, selectedCategory]);

  const renderPrice = (course) => {
    if (course.isFree) {
      return (
        <span className="text-base font-extrabold text-emerald-600">Free</span>
      );
    }
    const sale = course.price?.sale;
    const original = course.price?.original;

    if (sale != null) {
      return (
        <div className="flex items-baseline gap-1.5">
          <span className="text-base font-extrabold text-slate-900">
            Rs. {sale.toLocaleString()}
          </span>
          {original && (
            <span className="text-xs font-medium text-slate-400 line-through">
              Rs. {original.toLocaleString()}
            </span>
          )}
        </div>
      );
    }

    return (
      <span className="text-base font-extrabold text-slate-900">
        Rs. 14,900
      </span>
    );
  };

  return (
    <Layout>
      <div className="min-h-screen bg-slate-50/60 py-12 md:py-20">
        <div className="mx-auto max-w-[1500px] px-5 sm:px-7 lg:px-10 space-y-10">
          
          {/* Header Banner */}
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3.5 py-1.5 text-sm font-semibold text-indigo-600 border border-indigo-100">
              <Sparkles className="h-4 w-4" />
              <span>Explore & Upskill</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
              All <span className="text-indigo-600">Courses</span>
            </h1>
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
              Browse our growing catalog of practical classes engineered for every learning stage — from foundational skills to advanced industry workflows.
            </p>
          </div>

          {/* Search Bar & Category Filter Pills */}
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
              
              {/* Search Field */}
              <div className="relative w-full md:w-96">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by course title or instructor..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-10 pr-9 py-2.75 text-sm sm:text-base text-slate-900 placeholder-slate-400 focus:bg-white focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              {/* Course Count Display */}
              <div className="text-sm font-semibold text-slate-500 self-end md:self-auto">
                Showing <span className="text-slate-900 font-bold">{filteredCourses.length}</span> of {coursesList.length} courses
              </div>
            </div>

            {/* Category Filter Chips */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              <span className="text-sm font-semibold text-slate-500 flex items-center gap-1 pr-2">
                <Filter className="h-4 w-4 text-indigo-600" />
                Filter:
              </span>
              {categories.map((cat) => {
                const isActive = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`whitespace-nowrap px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                      isActive
                        ? "bg-indigo-600 text-white shadow-sm shadow-indigo-200"
                        : "bg-white border border-slate-200/80 text-slate-600 hover:bg-slate-100/80"
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Courses Grid */}
          {filteredCourses.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredCourses.map((course) => {
                const rating = course.rating || 4.8;
                return (
                  <article
                    key={course.id}
                    onClick={() => navigate(`/course/${course.id}`)}
                    className="group rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden cursor-pointer flex flex-col justify-between"
                  >
                    <div>
                      {/* Image Preview Container */}
                      <div className="relative aspect-video w-full overflow-hidden bg-slate-100">
                        <img
                          src={
                            course.image ||
                            "https://images.unsplash.com/photo-1587620962725-abab7fe55159?auto=format&fit=crop&q=80&w=600"
                          }
                          alt={course.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        {course.category && (
                          <span className="absolute top-3 left-3 bg-white/95 backdrop-blur-md text-slate-800 text-[10px] font-extrabold px-2.5 py-1 rounded-md shadow-sm uppercase tracking-wider">
                            {course.category}
                          </span>
                        )}
                      </div>

                      {/* Content Info */}
                      <div className="p-5 space-y-3">
                        <h2 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-2 leading-snug">
                          {course.name}
                        </h2>

                        {/* Instructor */}
                        {course.teacher && (
                          <div className="flex items-center gap-1.5 text-xs text-slate-500">
                            <User className="h-3.5 w-3.5 text-slate-400" />
                            <span className="font-medium text-slate-700">
                              {course.teacher}
                            </span>
                          </div>
                        )}

                        {/* Overview Snippet */}
                        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                          {course.overview ||
                            course.description ||
                            "Practical step-by-step guidance designed to build real-world skills."}
                        </p>

                        {/* Rating Row */}
                        <div className="flex items-center gap-1.5 pt-1">
                          <div className="flex items-center gap-0.5">
                            <Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
                          </div>
                          <span className="text-xs font-bold text-slate-800">
                            {rating}
                          </span>
                          {course.students && (
                            <span className="text-[11px] text-slate-400 ml-auto">
                              ({course.students.toLocaleString()})
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Bottom Pricing & CTA */}
                    <div className="px-5 py-3.5 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between mt-auto">
                      {renderPrice(course)}

                      <div className="flex items-center gap-1 text-xs font-semibold text-indigo-600 group-hover:translate-x-0.5 transition-transform">
                        <span>View</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            /* Empty Search State */
            <div className="rounded-3xl bg-white border border-slate-200/80 p-12 text-center max-w-lg mx-auto space-y-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 mx-auto">
                <BookOpen className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">No courses match your query</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Try searching with a different term or resetting the category filter.
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("All");
                }}
                className="inline-flex items-center gap-2 text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors"
              >
                Clear all filters
              </button>
            </div>
          )}

        </div>
      </div>
    </Layout>
  );
};

export default Courses;
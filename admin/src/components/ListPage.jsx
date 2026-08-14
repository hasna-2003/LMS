import React, { useState, useMemo, useEffect } from "react";
import {
  BookOpen,
  Search,
  Filter,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Eye,
  PlusCircle,
  AlertCircle,
  MoreVertical,
} from "lucide-react";
import { Link } from "react-router-dom";
import { listStyles } from "../assets/dummyStyles";

const API_BASE = "http://localhost:4000";

// Sample Initial Courses (Replace or extend with API data)
const INITIAL_COURSES = [
  {
    id: "1",
    title: "Full-Stack Web Development Bootcamp",
    instructor: "Alex Rivera",
    category: "Development",
    level: "Beginner",
    pricingType: "paid",
    price: 4999,
    students: 1240,
    status: "Active",
    createdAt: "2026-01-15",
  },
  {
    id: "2",
    title: "UI/UX Design Masterclass 2026",
    instructor: "Sarah Jenkins",
    category: "Design",
    level: "Intermediate",
    pricingType: "paid",
    price: 2999,
    students: 850,
    status: "Active",
    createdAt: "2026-02-01",
  },
  {
    id: "3",
    title: "Introduction to Python Programming",
    instructor: "Michael Chen",
    category: "Development",
    level: "Beginner",
    pricingType: "free",
    price: 0,
    students: 3100,
    status: "Active",
    createdAt: "2025-11-20",
  },
  {
    id: "4",
    title: "Advanced React & Next.js Architecture",
    instructor: "Alex Rivera",
    category: "Development",
    level: "Advanced",
    pricingType: "paid",
    price: 5999,
    students: 620,
    status: "Draft",
    createdAt: "2026-02-10",
  },
  {
    id: "5",
    title: "Digital Marketing & SEO Fundamentals",
    instructor: "Emma Watson",
    category: "Marketing",
    level: "Beginner",
    pricingType: "paid",
    price: 1999,
    students: 430,
    status: "Active",
    createdAt: "2026-01-28",
  },
];

const ITEMS_PER_PAGE = 4;

const ListPage = () => {
  const [courses, setCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortBy, setSortBy] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    const loadCourses = async () => {
      try {
        const response = await fetch(`${API_BASE}/api/course`);
        const data = await response.json();

        if (response.ok && data.success) {
          const mapped = (data.courses || []).map((course) => ({
            id: course._id,
            title: course.name || "Untitled Course",
            instructor: course.teacher || "Unknown",
            category: course.category || "General",
            level: course.level || "Beginner",
            pricingType: course.pricingType || "free",
            price:
              course.price?.sale != null
                ? Number(course.price.sale)
                : course.price?.original != null
                  ? Number(course.price.original)
                  : 0,
            students: course.students || course.totalRatings || 0,
            status: "Active",
            createdAt: course.createdAt || new Date().toISOString(),
          }));

          setCourses(mapped.length ? mapped : INITIAL_COURSES);
          return;
        }
      } catch (error) {
        console.error("Failed to load courses from API:", error);
      }

      setCourses(INITIAL_COURSES);
    };

    loadCourses();
  }, []);

  // Filter & Sort Logic
  const filteredCourses = useMemo(() => {
    return courses
      .filter((course) => {
        const matchesSearch =
          course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          course.instructor.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesCategory =
          categoryFilter === "All" || course.category === categoryFilter;

        const matchesStatus =
          statusFilter === "All" || course.status === statusFilter;

        return matchesSearch && matchesCategory && matchesStatus;
      })
      .sort((a, b) => {
        if (sortBy === "newest") return new Date(b.createdAt) - new Date(a.createdAt);
        if (sortBy === "oldest") return new Date(a.createdAt) - new Date(b.createdAt);
        if (sortBy === "students") return b.students - a.students;
        if (sortBy === "price") return b.price - a.price;
        return 0;
      });
  }, [courses, searchTerm, categoryFilter, statusFilter, sortBy]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredCourses.length / ITEMS_PER_PAGE) || 1;
  const paginatedCourses = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredCourses.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredCourses, currentPage]);

  const handleDelete = (id) => {
    setCourses((prev) => prev.filter((item) => item.id !== id));
    setDeleteId(null);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
      <div className="w-full space-y-6">
        
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-800 pb-5">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-2">
              <BookOpen className="h-7 w-7 text-indigo-500" /> Course Catalog
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Manage existing courses, publish drafts, and track student enrollments.
            </p>
          </div>
          <Link
            to="/addcourse"
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-xl transition shadow-lg shadow-indigo-600/20"
          >
            <PlusCircle className="h-4 w-4" /> Add New Course
          </Link>
        </div>

        {/* Filter and Control Toolbar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 bg-slate-800/60 p-4 rounded-2xl border border-slate-700/50 backdrop-blur-sm">
          
          {/* Search Box */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by title or instructor..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-9 pr-3 py-2 bg-slate-900/80 border border-slate-700 rounded-xl text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
            />
          </div>

          {/* Category Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <select
              value={categoryFilter}
              onChange={(e) => {
                setCategoryFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-9 pr-3 py-2 bg-slate-900/80 border border-slate-700 rounded-xl text-xs sm:text-sm text-slate-200 focus:outline-none focus:border-indigo-500 transition appearance-none"
            >
              <option value="All">All Categories</option>
              <option value="Development">Development</option>
              <option value="Design">Design</option>
              <option value="Marketing">Marketing</option>
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 bg-slate-900/80 border border-slate-700 rounded-xl text-xs sm:text-sm text-slate-200 focus:outline-none focus:border-indigo-500 transition"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Draft">Draft</option>
            </select>
          </div>

          {/* Sort By */}
          <div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3 py-2 bg-slate-900/80 border border-slate-700 rounded-xl text-xs sm:text-sm text-slate-200 focus:outline-none focus:border-indigo-500 transition"
            >
              <option value="newest">Sort by: Newest</option>
              <option value="oldest">Sort by: Oldest</option>
              <option value="students">Sort by: Top Enrolled</option>
              <option value="price">Sort by: Highest Price</option>
            </select>
          </div>
        </div>

        {/* Course Data Table */}
        <div className="bg-slate-800/40 rounded-2xl border border-slate-700/60 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-800/80 border-b border-slate-700 text-slate-400 text-xs uppercase tracking-wider">
                  <th className="py-3.5 px-4 font-semibold">Course Details</th>
                  <th className="py-3.5 px-4 font-semibold">Category</th>
                  <th className="py-3.5 px-4 font-semibold">Price</th>
                  <th className="py-3.5 px-4 font-semibold">Students</th>
                  <th className="py-3.5 px-4 font-semibold">Status</th>
                  <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-sm">
                {paginatedCourses.length > 0 ? (
                  paginatedCourses.map((course) => (
                    <tr key={course.id} className="hover:bg-slate-800/50 transition">
                      
                      {/* Course Title & Instructor */}
                      <td className="py-4 px-4">
                        <div>
                          <p className="font-semibold text-white hover:text-indigo-400 transition cursor-pointer">
                            {course.title}
                          </p>
                          <p className="text-xs text-slate-400 mt-0.5">
                            By {course.instructor} • <span className="text-slate-500">{course.level}</span>
                          </p>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-4 px-4">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-slate-700/50 text-slate-300 border border-slate-600/50">
                          {course.category}
                        </span>
                      </td>

                      {/* Price */}
                      <td className="py-4 px-4 font-medium text-slate-200">
                        {course.pricingType === "free" ? (
                          <span className="text-emerald-400 font-semibold">Free</span>
                        ) : (
                          `Rs. ${course.price.toLocaleString()}`
                        )}
                      </td>

                      {/* Students */}
                      <td className="py-4 px-4 text-slate-300">
                        {course.students.toLocaleString()}
                      </td>

                      {/* Status Badge */}
                      <td className="py-4 px-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                            course.status === "Active"
                              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                              : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                          }`}
                        >
                          {course.status}
                        </span>
                      </td>

                      {/* Action Buttons */}
                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            title="Preview Course"
                            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700/60 transition"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            title="Edit Course"
                            className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-400 hover:bg-slate-700/60 transition"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            title="Delete Course"
                            onClick={() => setDeleteId(course.id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-700/60 transition"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-400">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <AlertCircle className="h-8 w-8 text-slate-500" />
                        <p className="text-base font-medium">No courses found</p>
                        <p className="text-xs text-slate-500">
                          Try adjusting your search criteria or clear active filters.
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {filteredCourses.length > 0 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-slate-800 bg-slate-900/40 text-xs sm:text-sm text-slate-400">
              <p>
                Showing Page <span className="font-semibold text-white">{currentPage}</span> of{" "}
                <span className="font-semibold text-white">{totalPages}</span>
              </p>
              <div className="flex items-center gap-2">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                  className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>

      </div>

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-white">Confirm Course Deletion</h3>
            <p className="text-sm text-slate-300">
              Are you sure you want to delete this course? This action cannot be undone and will affect all registered metrics.
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setDeleteId(null)}
                className="px-4 py-2 bg-slate-700 text-slate-300 rounded-xl text-xs sm:text-sm hover:bg-slate-600 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteId)}
                className="px-4 py-2 bg-rose-600 text-white rounded-xl text-xs sm:text-sm hover:bg-rose-500 transition shadow-lg shadow-rose-600/20"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListPage;
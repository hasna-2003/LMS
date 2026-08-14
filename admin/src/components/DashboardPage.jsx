import React, { useEffect, useState, useMemo, useCallback } from "react";
import {
  BookMarked,
  BookOpenText,
  Search,
  ShoppingCart,
  Users,
  X,
  AlertCircle,
  TrendingUp,
} from "lucide-react";

const API_BASE = "http://localhost:4000";

const fmtCurrency = (n) => {
  if (n == null) return "Rs. 0";
  const num = Number(n);
  if (Number.isNaN(num)) return "Rs. 0";
  return `Rs. ${num.toLocaleString()}`;
};

const DashboardPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statsData, setStatsData] = useState(null);
  const [coursesData, setCoursesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const buildStats = useCallback((backendStats) => {
    const totalBookings = backendStats?.totalBookings ?? 0;
    const totalRevenue = backendStats?.totalRevenue ?? 0;
    const bookingsLast7Days = backendStats?.bookingsLast7Days ?? 0;
    const topCourses = backendStats?.topCourses ?? [];

    return [
      {
        title: "Total Bookings",
        value: totalBookings.toLocaleString(),
        icon: Users,
        color: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20",
      },
      {
        title: "Total Revenue",
        value: fmtCurrency(totalRevenue),
        icon: TrendingUp,
        color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
      },
      {
        title: "Bookings (Last 7d)",
        value: bookingsLast7Days.toLocaleString(),
        icon: ShoppingCart,
        color: "text-amber-400 bg-amber-500/10 border-amber-500/20",
      },
      {
        title: "Top Courses",
        value: (topCourses && topCourses.length) || 0,
        icon: BookMarked,
        color: "text-purple-400 bg-purple-500/10 border-purple-500/20",
      },
    ];
  }, []);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);

    const fetchStats = () =>
      fetch(`${API_BASE}/api/booking/stats`)
        .then((r) => r.json())
        .then((j) =>
          j.success ? j.stats : Promise.reject(j.message || "Failed to load booking stats")
        );

    const fetchCourses = () =>
      fetch(`${API_BASE}/api/course`)
        .then((r) => r.json())
        .then((j) =>
          j.success ? j.courses : Promise.reject(j.message || "Failed to load course list")
        );

    Promise.all([fetchStats(), fetchCourses()])
      .then(([stats, courses]) => {
        if (!mounted) return;

        const topLookup = {};
        if (Array.isArray(stats?.topCourses)) {
          stats.topCourses.forEach((t) => {
            if (!t) return;
            const name = t.courseName || "";
            topLookup[name] = {
              purchases: Number(t.count || 0),
              revenue: Number(t.revenue || 0),
            };
          });
        }

        const mapped = (courses || []).map((c) => {
          const id = c._id ?? c.id ?? c.courseId ?? Math.random().toString();
          const name = c.name ?? c.title ?? "Untitled Course";
          const instructor = c.teacher ?? c.instructor ?? "Unknown";
          const metrics = topLookup[name] || { purchases: 0, revenue: 0 };
          
          const students = metrics.purchases || (c.students ?? 0);
          const purchases = metrics.purchases || (c.purchases ?? 0);
          const earnings = metrics.revenue ?? c.earnings ?? 0;

          let priceDisplay = "Free";
          if (c.price && (c.price.sale != null || c.price.original != null)) {
            const sale = c.price.sale != null ? Number(c.price.sale) : null;
            const orig = c.price.original != null ? Number(c.price.original) : null;
            priceDisplay =
              sale != null
                ? fmtCurrency(sale)
                : orig != null
                ? fmtCurrency(orig)
                : "Free";
          } else if (c.pricingType && c.pricingType !== "free") {
            priceDisplay = "Rs. 0";
          }

          return {
            id,
            name,
            instructor,
            students,
            price: priceDisplay,
            purchases,
            earnings: fmtCurrency(earnings),
          };
        });

        setStatsData(buildStats(stats));
        setCoursesData(mapped);
      })
      .catch((err) => {
        console.error("Dashboard fetch error:", err);
        if (mounted) setError(String(err?.message || err) || "Failed to load dashboard data");
      })
      .finally(() => mounted && setLoading(false));

    return () => {
      mounted = false;
    };
  }, [buildStats]);

  const stats = useMemo(() => {
    if (statsData) return statsData;
    return [
      { title: "Total Bookings", value: "0", icon: Users, color: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20" },
      { title: "Total Revenue", value: "Rs. 0", icon: TrendingUp, color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" },
      { title: "Bookings (Last 7d)", value: "0", icon: ShoppingCart, color: "text-amber-400 bg-amber-500/10 border-amber-500/20" },
      { title: "Top Courses", value: "0", icon: BookMarked, color: "text-purple-400 bg-purple-500/10 border-purple-500/20" },
    ];
  }, [statsData]);

  const filteredCourses = useMemo(() => {
    return (coursesData || []).filter((course) => {
      const match = `${course.name || ""} ${course.instructor || ""}`.toLowerCase();
      return match.includes(searchTerm.toLowerCase());
    });
  }, [coursesData, searchTerm]);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
      <div className="w-full space-y-6">
        
        {/* Header */}
        <div className="border-b border-slate-800 pb-5">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Dashboard Overview
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Welcome back! Here is an overview of course performance and revenue metrics.
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="flex items-center gap-3 rounded-xl bg-rose-500/10 border border-rose-500/30 p-4 text-xs sm:text-sm text-rose-400" role="alert">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Analytics Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.title}
                className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-5 shadow-lg flex items-center justify-between"
              >
                <div>
                  <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">{stat.title}</p>
                  {loading ? (
                    <div className="h-7 w-20 bg-slate-700/60 animate-pulse rounded-md mt-2" />
                  ) : (
                    <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
                  )}
                </div>
                <div className={`p-3 rounded-xl border ${stat.color}`}>
                  {Icon && <Icon className="h-6 w-6" />}
                </div>
              </div>
            );
          })}
        </div>

        {/* Course Performance Table Section */}
        <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <BookOpenText className="h-5 w-5 text-indigo-400" />
              <h2 className="text-lg font-semibold text-white">Course Performance</h2>
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search by title or instructor..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-9 py-2 bg-slate-900/80 border border-slate-700 rounded-xl text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          {/* Table Container */}
          <div className="overflow-x-auto rounded-xl border border-slate-700/60">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-900/60 border-b border-slate-700/60 text-xs text-slate-400 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="px-4 sm:px-6 py-3.5">Course</th>
                  <th className="px-4 sm:px-6 py-3.5">Students</th>
                  <th className="px-4 sm:px-6 py-3.5">Price</th>
                  <th className="px-4 sm:px-6 py-3.5">Purchases</th>
                  <th className="px-4 sm:px-6 py-3.5">Earnings</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-700/40 text-xs sm:text-sm">
                {loading ? (
                  Array.from({ length: 4 }).map((_, idx) => (
                    <tr key={idx} className="hover:bg-slate-700/20 transition">
                      <td className="px-4 sm:px-6 py-4">
                        <div className="space-y-2">
                          <div className="h-4 w-48 bg-slate-700/50 animate-pulse rounded" />
                          <div className="h-3 w-28 bg-slate-800 animate-pulse rounded" />
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-4">
                        <div className="h-4 w-12 bg-slate-700/50 animate-pulse rounded" />
                      </td>
                      <td className="px-4 sm:px-6 py-4">
                        <div className="h-4 w-16 bg-slate-700/50 animate-pulse rounded" />
                      </td>
                      <td className="px-4 sm:px-6 py-4">
                        <div className="h-4 w-12 bg-slate-700/50 animate-pulse rounded" />
                      </td>
                      <td className="px-4 sm:px-6 py-4">
                        <div className="h-4 w-20 bg-slate-700/50 animate-pulse rounded" />
                      </td>
                    </tr>
                  ))
                ) : (
                  filteredCourses.map((course) => (
                    <tr key={course.id} className="hover:bg-slate-700/30 transition">
                      <td className="px-4 sm:px-6 py-4">
                        <div>
                          <p className="font-semibold text-slate-100">{course.name}</p>
                          <p className="text-xs text-slate-400 mt-0.5">{course.instructor}</p>
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-4 font-medium text-slate-300">
                        {course.students.toLocaleString()}
                      </td>
                      <td className="px-4 sm:px-6 py-4 font-medium text-indigo-400">
                        {course.price}
                      </td>
                      <td className="px-4 sm:px-6 py-4">
                        <div className="inline-flex items-center gap-1.5 font-medium text-slate-300">
                          <ShoppingCart className="h-3.5 w-3.5 text-slate-400" />
                          <span>{course.purchases.toLocaleString()}</span>
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-4 font-semibold text-emerald-400">
                        {course.earnings}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            {/* Empty State */}
            {filteredCourses.length === 0 && !loading && (
              <div className="py-12 text-center space-y-3">
                <Search className="h-10 w-10 text-slate-500 mx-auto" />
                <p className="text-slate-400 text-sm">No courses match your search criteria.</p>
                <button
                  type="button"
                  onClick={() => setSearchTerm("")}
                  className="px-4 py-2 text-xs font-medium bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg transition"
                >
                  Clear Search
                </button>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default DashboardPage;
import React, { useState, useMemo } from "react";
import {
  BookmarkCheck,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  XCircle,
  TrendingUp,
  CreditCard,
  User,
  Calendar,
} from "lucide-react";

// Mock Bookings Data (Replace with API call)
const INITIAL_BOOKINGS = [
  {
    id: "BK-9041",
    studentName: "Devon Lane",
    email: "devon@example.com",
    courseTitle: "Full-Stack Web Development Bootcamp",
    amount: 4999,
    status: "Confirmed",
    paymentMethod: "Card",
    date: "2026-02-12",
  },
  {
    id: "BK-9042",
    studentName: "Kristin Watson",
    email: "kristin@example.com",
    courseTitle: "UI/UX Design Masterclass 2026",
    amount: 2999,
    status: "Pending",
    paymentMethod: "Bank Transfer",
    date: "2026-02-13",
  },
  {
    id: "BK-9043",
    studentName: "Eleanor Pena",
    email: "eleanor@example.com",
    courseTitle: "Advanced React & Next.js Architecture",
    amount: 5999,
    status: "Confirmed",
    paymentMethod: "Card",
    date: "2026-02-14",
  },
  {
    id: "BK-9044",
    studentName: "Guy Hawkins",
    email: "guy@example.com",
    courseTitle: "Digital Marketing & SEO Fundamentals",
    amount: 1999,
    status: "Refunded",
    paymentMethod: "Card",
    date: "2026-02-10",
  },
];

const BookingsPage = () => {
  const [bookings, setBookings] = useState(INITIAL_BOOKINGS);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // Filter Bookings
  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      const matchesSearch =
        b.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.courseTitle.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = statusFilter === "All" || b.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [bookings, searchTerm, statusFilter]);

  // Aggregate Stats
  const stats = useMemo(() => {
    const total = bookings.length;
    const confirmed = bookings.filter((b) => b.status === "Confirmed");
    const revenue = confirmed.reduce((sum, b) => sum + b.amount, 0);
    const pending = bookings.filter((b) => b.status === "Pending").length;

    return { total, revenue, pending, confirmedCount: confirmed.length };
  }, [bookings]);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
      <div className="w-full space-y-6">

        {/* Page Header */}
        <div className="border-b border-slate-800 pb-5">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-2">
            <BookmarkCheck className="h-7 w-7 text-indigo-500" /> Bookings & Enrollments
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Monitor real-time course purchases, payment statuses, and transaction details.
          </p>
        </div>

        {/* Top Summary Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-800/60 p-5 rounded-2xl border border-slate-700/50 flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400 uppercase font-medium">Total Bookings</p>
              <p className="text-2xl font-bold text-white mt-1">{stats.total}</p>
            </div>
            <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-xl border border-indigo-500/20">
              <User className="h-6 w-6" />
            </div>
          </div>

          <div className="bg-slate-800/60 p-5 rounded-2xl border border-slate-700/50 flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400 uppercase font-medium">Total Revenue</p>
              <p className="text-2xl font-bold text-emerald-400 mt-1">Rs. {stats.revenue.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20">
              <TrendingUp className="h-6 w-6" />
            </div>
          </div>

          <div className="bg-slate-800/60 p-5 rounded-2xl border border-slate-700/50 flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400 uppercase font-medium">Confirmed Purchases</p>
              <p className="text-2xl font-bold text-white mt-1">{stats.confirmedCount}</p>
            </div>
            <div className="p-3 bg-blue-500/10 text-blue-400 rounded-xl border border-blue-500/20">
              <CheckCircle2 className="h-6 w-6" />
            </div>
          </div>

          <div className="bg-slate-800/60 p-5 rounded-2xl border border-slate-700/50 flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400 uppercase font-medium">Pending Payments</p>
              <p className="text-2xl font-bold text-amber-400 mt-1">{stats.pending}</p>
            </div>
            <div className="p-3 bg-amber-500/10 text-amber-400 rounded-xl border border-amber-500/20">
              <Clock className="h-6 w-6" />
            </div>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-3 bg-slate-800/60 p-4 rounded-2xl border border-slate-700/50">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by student name, ID, or course..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-900/80 border border-slate-700 rounded-xl text-xs sm:text-sm text-slate-200 focus:outline-none focus:border-indigo-500 transition"
            />
          </div>

          <div className="w-full sm:w-48">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 bg-slate-900/80 border border-slate-700 rounded-xl text-xs sm:text-sm text-slate-200 focus:outline-none focus:border-indigo-500 transition"
            >
              <option value="All">All Statuses</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Pending">Pending</option>
              <option value="Refunded">Refunded</option>
            </select>
          </div>
        </div>

        {/* Bookings Table */}
        <div className="bg-slate-800/40 rounded-2xl border border-slate-700/60 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-800/80 border-b border-slate-700 text-slate-400 text-xs uppercase tracking-wider">
                  <th className="py-3.5 px-4 font-semibold">Booking ID</th>
                  <th className="py-3.5 px-4 font-semibold">Student</th>
                  <th className="py-3.5 px-4 font-semibold">Course</th>
                  <th className="py-3.5 px-4 font-semibold">Amount</th>
                  <th className="py-3.5 px-4 font-semibold">Method</th>
                  <th className="py-3.5 px-4 font-semibold">Status</th>
                  <th className="py-3.5 px-4 font-semibold">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-sm">
                {filteredBookings.length > 0 ? (
                  filteredBookings.map((b) => (
                    <tr key={b.id} className="hover:bg-slate-800/50 transition">
                      <td className="py-4 px-4 font-mono text-xs text-indigo-400 font-semibold">
                        {b.id}
                      </td>
                      <td className="py-4 px-4">
                        <div>
                          <p className="font-semibold text-white">{b.studentName}</p>
                          <p className="text-xs text-slate-400">{b.email}</p>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-slate-300 max-w-xs truncate">
                        {b.courseTitle}
                      </td>
                      <td className="py-4 px-4 font-medium text-slate-100">
                        Rs. {b.amount.toLocaleString()}
                      </td>
                      <td className="py-4 px-4 text-xs text-slate-400">
                        <span className="inline-flex items-center gap-1">
                          <CreditCard className="h-3.5 w-3.5 text-slate-500" />
                          {b.paymentMethod}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                            b.status === "Confirmed"
                              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                              : b.status === "Pending"
                              ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                              : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                          }`}
                        >
                          {b.status === "Confirmed" && <CheckCircle2 className="h-3 w-3" />}
                          {b.status === "Pending" && <Clock className="h-3 w-3" />}
                          {b.status === "Refunded" && <XCircle className="h-3 w-3" />}
                          {b.status}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-xs text-slate-400">
                        <span className="inline-flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5 text-slate-500" />
                          {b.date}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-400">
                      No matching booking records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};

export default BookingsPage;
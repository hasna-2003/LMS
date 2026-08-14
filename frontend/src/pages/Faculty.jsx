import React, { useState, useMemo } from "react";
import Layout from "../components/Layout";
import {
  Search,
  Sparkles,
  Linkedin,
  Mail,
  BookOpen,
  Award,
  Filter,
  X,
  ExternalLink,
} from "lucide-react";

// Faculty dataset with rich metadata
const INITIAL_FACULTY = [
  {
    id: 1,
    name: "Sophia Miller",
    role: "Lead React & Frontend Specialist",
    department: "Frontend Development",
    experience: "10+ Yrs Exp",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400",
    bio: "Ex-Meta engineer specializing in high-performance Web Applications, State Management, and Design Systems.",
    coursesCount: 8,
    email: "sophia.m@example.com",
    linkedin: "https://linkedin.com",
  },
  {
    id: 2,
    name: "John Smith",
    role: "Full-Stack & Systems Architect",
    department: "Backend & Systems",
    experience: "12+ Yrs Exp",
    avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400",
    bio: "Cloud solutions expert focusing on distributed systems, REST/GraphQL APIs, and microservice architectures.",
    coursesCount: 12,
    email: "john.s@example.com",
    linkedin: "https://linkedin.com",
  },
  {
    id: 3,
    name: "Sarah Johnson",
    role: "JavaScript & Engine Performance Expert",
    department: "Core Engineering",
    experience: "8+ Yrs Exp",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=400",
    bio: "Passionate educator specializing in ESNext features, asynchronous architecture, and web security best practices.",
    coursesCount: 6,
    email: "sarah.j@example.com",
    linkedin: "https://linkedin.com",
  },
  {
    id: 4,
    name: "David Chen",
    role: "UI/UX & Product Design Instructor",
    department: "Design & UX",
    experience: "7+ Yrs Exp",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400",
    bio: "Design lead bridging the gap between Figma design tokens, micro-interactions, and responsive frontend systems.",
    coursesCount: 5,
    email: "david.c@example.com",
    linkedin: "https://linkedin.com",
  },
];

const Faculty = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDept, setSelectedDept] = useState("All");

  // Extract unique departments for filter chips
  const departments = useMemo(() => {
    const set = new Set(INITIAL_FACULTY.map((f) => f.department).filter(Boolean));
    return ["All", ...Array.from(set)];
  }, []);

  // Filter faculty members
  const filteredFaculty = useMemo(() => {
    return INITIAL_FACULTY.filter((person) => {
      const matchesSearch =
        person.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        person.role.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesDept =
        selectedDept === "All" || person.department === selectedDept;

      return matchesSearch && matchesDept;
    });
  }, [searchQuery, selectedDept]);

  return (
    <Layout>
      <div className="min-h-screen bg-slate-50/60 py-12 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-10">

          {/* Header Banner */}
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3.5 py-1.5 text-xs font-semibold text-indigo-600 border border-indigo-100">
              <Sparkles className="h-3.5 w-3.5" />
              <span>World-Class Instructors</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Meet the <span className="text-indigo-600">Faculty</span>
            </h1>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Our mentors bring real-world software engineering expertise, industry insights, and a genuine passion for modern hands-on teaching.
            </p>
          </div>

          {/* Search Bar & Department Filter */}
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
              
              {/* Search Field */}
              <div className="relative w-full md:w-96">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search faculty by name or role..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-10 pr-9 py-2.5 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
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

              {/* Faculty Count */}
              <div className="text-xs font-semibold text-slate-500 self-end md:self-auto">
                Showing <span className="text-slate-900 font-bold">{filteredFaculty.length}</span> of {INITIAL_FACULTY.length} instructors
              </div>
            </div>

            {/* Department Filter Chips */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              <span className="text-xs font-semibold text-slate-500 flex items-center gap-1 pr-2">
                <Filter className="h-3.5 w-3.5 text-indigo-600" />
                Department:
              </span>
              {departments.map((dept) => {
                const isActive = selectedDept === dept;
                return (
                  <button
                    key={dept}
                    onClick={() => setSelectedDept(dept)}
                    className={`whitespace-nowrap px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 ${
                      isActive
                        ? "bg-indigo-600 text-white shadow-sm shadow-indigo-200"
                        : "bg-white border border-slate-200/80 text-slate-600 hover:bg-slate-100/80"
                    }`}
                  >
                    {dept}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Faculty Grid */}
          {filteredFaculty.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredFaculty.map((person) => (
                <div
                  key={person.id}
                  className="group rounded-2xl bg-white border border-slate-200/80 p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    
                    {/* Top Avatar & Badges */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="relative h-16 w-16 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200/60 shadow-inner">
                        {person.avatar ? (
                          <img
                            src={person.avatar}
                            alt={person.name}
                            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center bg-indigo-50 font-bold text-indigo-600 text-lg">
                            {person.name.charAt(0)}
                          </div>
                        )}
                      </div>

                      <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-bold text-slate-600">
                        <Award className="h-3 w-3 text-amber-500" />
                        {person.experience}
                      </span>
                    </div>

                    {/* Faculty Info */}
                    <div className="space-y-1">
                      <h2 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                        {person.name}
                      </h2>
                      <p className="text-xs font-semibold text-indigo-600 leading-snug">
                        {person.role}
                      </p>
                    </div>

                    {/* Bio */}
                    <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">
                      {person.bio}
                    </p>

                    {/* Stats */}
                    <div className="flex items-center gap-2 pt-2 border-t border-slate-100 text-xs text-slate-500 font-medium">
                      <BookOpen className="h-3.5 w-3.5 text-slate-400" />
                      <span>{person.coursesCount} Courses Taught</span>
                    </div>
                  </div>

                  {/* Actions & Links */}
                  <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <a
                        href={`mailto:${person.email}`}
                        title="Contact Email"
                        className="p-2 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                      >
                        <Mail className="h-4 w-4" />
                      </a>
                      <a
                        href={person.linkedin}
                        target="_blank"
                        rel="noreferrer"
                        title="LinkedIn Profile"
                        className="p-2 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                      >
                        <Linkedin className="h-4 w-4" />
                      </a>
                    </div>

                    <button className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors">
                      <span>Profile</span>
                      <ExternalLink className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="rounded-3xl bg-white border border-slate-200/80 p-12 text-center max-w-lg mx-auto space-y-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 mx-auto">
                <Search className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">No instructors found</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                We couldn't find any faculty members matching your filter criteria.
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedDept("All");
                }}
                className="inline-flex items-center gap-2 text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors"
              >
                Reset filters
              </button>
            </div>
          )}

        </div>
      </div>
    </Layout>
  );
};

export default Faculty;
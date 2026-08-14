import React, { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import courses from "../assets/dummyData";
import {
  Star,
  User,
  Clock,
  BookOpen,
  Award,
  CheckCircle2,
  ArrowLeft,
  Share2,
  Heart,
  Globe,
  ShieldCheck,
  PlayCircle,
  FileText,
  Lock,
} from "lucide-react";

const CourseDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [isWishlisted, setIsWishlisted] = useState(false);

  // Safe search across array export or default export
  const courseList = Array.isArray(courses) ? courses : courses?.dummyCourses || [];
  const course = courseList.find((item) => String(item.id) === String(id));

  if (!course) {
    return (
      <Layout>
        <div className="min-h-[70vh] flex flex-col items-center justify-center bg-slate-50 px-4 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 mb-4">
            <BookOpen className="h-8 w-8" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Course Not Found</h1>
          <p className="mt-2 text-sm text-slate-600 max-w-md">
            The course you are looking for might have been removed or the link is invalid.
          </p>
          <Link
            to="/courses"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-indigo-700 transition-all"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to All Courses</span>
          </Link>
        </div>
      </Layout>
    );
  }

  // Course attributes with defaults
  const courseRating = course.rating || 4.8;
  const totalStudents = course.students ? course.students.toLocaleString() : "1,240";
  const duration = course.duration || "32 hours";
  const category = course.category || "Development";
  const teacherName = course.teacher || "Senior Industry Mentor";

  // Mock curriculum modules if dummy data lacks it
  const syllabus = course.curriculum || [
    { title: "Module 1: Introduction & Environment Setup", lessons: "4 Lessons • 45 mins" },
    { title: "Module 2: Core Fundamentals & Practical Exercises", lessons: "8 Lessons • 3.5 hrs" },
    { title: "Module 3: Advanced Architecture & Best Practices", lessons: "12 Lessons • 6 hrs" },
    { title: "Module 4: Real-World Capstone Project & Deployment", lessons: "6 Lessons • 4 hrs" },
  ];

  const highlights = course.highlights || [
    "Build real-world projects to showcase on your portfolio",
    "Master industry-standard tools, libraries, and workflows",
    "Learn best practices for performance, scalability, and code quality",
    "Includes downloadable source code, templates, and reference guides",
    "Direct Q&A support from instructor and Sri Lankan mentor community",
    "Verified Certificate of Completion upon course graduation",
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-slate-50/60 pb-16 pt-6">
        
        {/* Navigation Breadcrumb / Back Link */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-indigo-600 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Courses</span>
          </button>
        </div>

        {/* Hero Section */}
        <section className="bg-slate-900 text-white border-y border-slate-800 py-10 sm:py-14">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid gap-8 lg:grid-cols-12 items-start">
            
            <div className="lg:col-span-8 space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-md bg-indigo-500/20 px-2.5 py-1 text-xs font-bold text-indigo-300 border border-indigo-500/30 uppercase tracking-wider">
                  {category}
                </span>
                <span className="text-xs text-slate-400">• Updated August 2026</span>
              </div>

              <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-tight">
                {course.name}
              </h1>

              <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-3xl">
                {course.overview ||
                  course.description ||
                  "Gain hands-on expertise with step-by-step guidance, practical project builds, and industry insights tailored for ambitious learners."}
              </p>

              {/* Stats Row */}
              <div className="flex flex-wrap items-center gap-4 sm:gap-6 pt-2 text-xs sm:text-sm text-slate-300">
                <div className="flex items-center gap-1.5">
                  <div className="flex items-center text-amber-400">
                    <Star className="h-4 w-4 fill-amber-400" />
                  </div>
                  <span className="font-bold text-white">{courseRating}</span>
                  <span className="text-slate-400">({totalStudents} enrolled)</span>
                </div>

                <div className="flex items-center gap-1.5 text-slate-300">
                  <User className="h-4 w-4 text-indigo-400" />
                  <span>Instructor: <strong className="text-white">{teacherName}</strong></span>
                </div>

                <div className="flex items-center gap-1.5 text-slate-300">
                  <Clock className="h-4 w-4 text-indigo-400" />
                  <span>{duration} total length</span>
                </div>

                <div className="flex items-center gap-1.5 text-slate-300">
                  <Globe className="h-4 w-4 text-indigo-400" />
                  <span>English / Sinhala Subtitles</span>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* Main Content Area */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid gap-10 lg:grid-cols-12 items-start">
            
            {/* Left Content (Tabs, Overview, Curriculum) */}
            <div className="lg:col-span-8 space-y-8">
              
              {/* Navigation Tabs */}
              <div className="flex border-b border-slate-200 gap-6 text-sm font-semibold">
                {[
                  { id: "overview", label: "Overview & Highlights" },
                  { id: "curriculum", label: "Syllabus" },
                  { id: "instructor", label: "Instructor" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`pb-3 transition-all relative ${
                      activeTab === tab.id
                        ? "text-indigo-600 font-bold"
                        : "text-slate-500 hover:text-slate-900"
                    }`}
                  >
                    {tab.label}
                    {activeTab === tab.id && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 rounded-full" />
                    )}
                  </button>
                ))}
              </div>

              {/* Tab 1: Overview & Highlights */}
              {activeTab === "overview" && (
                <div className="space-y-8">
                  {/* What You'll Learn Box */}
                  <div className="rounded-2xl bg-white border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-4">
                    <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-indigo-600" />
                      What You'll Learn
                    </h2>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {highlights.map((item, idx) => (
                        <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                          <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* About Course Narrative */}
                  <div className="rounded-2xl bg-white border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-4">
                    <h2 className="text-lg font-bold text-slate-900">Course Description</h2>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      {course.description || course.overview || "This course is meticulously designed to take you from foundational concepts to advanced, practical execution. Whether you are looking to upskill, transition careers, or build your own startup projects in Sri Lanka, this curriculum equips you with modern workflows."}
                    </p>
                  </div>
                </div>
              )}

              {/* Tab 2: Curriculum / Syllabus */}
              {activeTab === "curriculum" && (
                <div className="rounded-2xl bg-white border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                    <h2 className="text-lg font-bold text-slate-900">Course Content</h2>
                    <span className="text-xs font-semibold text-slate-500">
                      {syllabus.length} Modules
                    </span>
                  </div>

                  <div className="space-y-3">
                    {syllabus.map((module, idx) => (
                      <div
                        key={idx}
                        className="rounded-xl border border-slate-200/80 p-4 hover:border-indigo-200 transition-colors bg-slate-50/50 flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 font-semibold text-xs">
                            {idx + 1}
                          </div>
                          <div>
                            <h3 className="text-sm font-bold text-slate-900">{module.title}</h3>
                            <p className="text-xs text-slate-500 mt-0.5">{module.lessons}</p>
                          </div>
                        </div>
                        <Lock className="h-4 w-4 text-slate-400" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab 3: Instructor Profile */}
              {activeTab === "instructor" && (
                <div className="rounded-2xl bg-white border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-bold text-xl shadow-md">
                      {teacherName.charAt(0)}
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-slate-900">{teacherName}</h2>
                      <p className="text-xs font-medium text-slate-500">Lead Educator & Industry Consultant</p>
                    </div>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-4">
                    With over 8+ years of industry experience building software and training engineering teams, {teacherName} focuses on breaking down complex technical principles into actionable, practical lessons.
                  </p>
                </div>
              )}

            </div>

            {/* Right Sticky Enrolment Card */}
            <div className="lg:col-span-4 lg:sticky lg:top-24">
              <div className="rounded-3xl bg-white border border-slate-200/80 p-6 shadow-lg space-y-6">
                
                {/* Image Preview Container */}
                <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-slate-100 border border-slate-200/60">
                  <img
                    src={course.image || "https://images.unsplash.com/photo-1587620962725-abab7fe55159?auto=format&fit=crop&q=80&w=600"}
                    alt={course.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-slate-900/20 flex items-center justify-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90 text-indigo-600 shadow-lg backdrop-blur-sm hover:scale-105 transition-transform">
                      <PlayCircle className="h-6 w-6 ml-0.5" />
                    </div>
                  </div>
                </div>

                {/* Price Display */}
                <div className="space-y-1">
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-black text-slate-900">
                      {course.isFree ? "Free" : `Rs. ${course.price?.sale || 14900}`}
                    </span>
                    {!course.isFree && course.price?.original && (
                      <span className="text-xs font-semibold text-slate-400 line-through">
                        Rs. {course.price.original}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] font-medium text-emerald-600 flex items-center gap-1">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    <span>7-Day Money-Back Guarantee</span>
                  </p>
                </div>

                {/* CTAs */}
                <div className="space-y-2.5 pt-2">
                  <button
                    onClick={() => alert(`Enrolling in: ${course.name}`)}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3.5 px-4 text-sm font-bold text-white shadow-md hover:bg-indigo-700 hover:shadow-indigo-200 transition-all active:scale-[0.99]"
                  >
                    <span>Enroll Now</span>
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setIsWishlisted(!isWishlisted)}
                      className={`flex-1 inline-flex items-center justify-center gap-2 rounded-xl border py-2.5 text-xs font-semibold transition-colors ${
                        isWishlisted
                          ? "border-rose-200 bg-rose-50 text-rose-600"
                          : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      <Heart className={`h-4 w-4 ${isWishlisted ? "fill-rose-600" : ""}`} />
                      <span>{isWishlisted ? "Wishlisted" : "Save Course"}</span>
                    </button>

                    <button
                      onClick={() => navigator.clipboard?.writeText(window.location.href)}
                      className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
                      title="Share link"
                    >
                      <Share2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Included Checklist */}
                <div className="border-t border-slate-100 pt-4 space-y-2.5">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    This Course Includes:
                  </h4>
                  <ul className="space-y-2 text-xs text-slate-600">
                    <li className="flex items-center gap-2">
                      <Clock className="h-3.5 w-3.5 text-indigo-600" />
                      <span>Full lifetime access</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <FileText className="h-3.5 w-3.5 text-indigo-600" />
                      <span>Downloadable exercise files</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Award className="h-3.5 w-3.5 text-indigo-600" />
                      <span>Verified Completion Certificate</span>
                    </li>
                  </ul>
                </div>

              </div>
            </div>

          </div>
        </div>

      </div>
    </Layout>
  );
};

export default CourseDetailPage;
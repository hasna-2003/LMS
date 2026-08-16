import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle2, PlayCircle, Lock } from "lucide-react";

const LearnPage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [activeLesson, setActiveLesson] = useState(0);

  // Sample course content structure
  const lessons = [
    { id: 1, title: "1. Introduction to the Course", duration: "10:15", completed: true },
    { id: 2, title: "2. Setting Up Your Environment", duration: "18:40", completed: true },
    { id: 3, title: "3. State Management with Redux Toolkit", duration: "25:30", completed: false },
    { id: 4, title: "4. Building Middleware & Async Thunks", duration: "32:10", completed: false },
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col">
      {/* Top Header */}
      <header className="h-16 border-b border-slate-800 px-6 flex items-center justify-between bg-slate-950">
        <button
          onClick={() => navigate("/my-courses")}
          className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-all"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </button>
        <h1 className="text-sm font-semibold text-slate-200">
          Course ID: {courseId}
        </h1>
      </header>

      {/* Main Learning Workspace */}
      <div className="flex-1 flex flex-col lg:flex-row">
        {/* Video Player Section */}
        <div className="flex-1 bg-black p-6 flex flex-col items-center justify-center min-h-[400px]">
          <div className="w-full max-w-4xl aspect-video bg-slate-800 rounded-2xl flex items-center justify-center border border-slate-700 shadow-2xl">
            <div className="text-center">
              <PlayCircle className="w-16 h-16 text-indigo-500 mx-auto mb-3 animate-pulse" />
              <p className="text-slate-400 text-sm">
                Playing: {lessons[activeLesson].title}
              </p>
            </div>
          </div>
        </div>

        {/* Sidebar: Lesson Curriculum */}
        <div className="w-full lg:w-96 bg-slate-950 border-l border-slate-800 p-6 overflow-y-auto">
          <h2 className="text-lg font-bold mb-4 text-slate-100">Course Syllabus</h2>
          <div className="space-y-2">
            {lessons.map((lesson, idx) => (
              <button
                key={lesson.id}
                onClick={() => setActiveLesson(idx)}
                className={`w-full p-4 rounded-xl flex items-center justify-between text-left transition-all ${
                  activeLesson === idx
                    ? "bg-indigo-600/20 border border-indigo-500/50 text-indigo-300"
                    : "bg-slate-900 border border-slate-800 text-slate-400 hover:bg-slate-850"
                }`}
              >
                <div className="flex items-center gap-3">
                  {lesson.completed ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                  ) : (
                    <PlayCircle className="w-5 h-5 text-slate-500 shrink-0" />
                  )}
                  <span className="text-sm font-medium leading-snug">{lesson.title}</span>
                </div>
                <span className="text-xs text-slate-500">{lesson.duration}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearnPage;
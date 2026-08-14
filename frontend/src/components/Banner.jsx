import React from "react";
import { Sparkles, ArrowRight, PlayCircle, Star } from "lucide-react";

const Banner = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-indigo-700 via-purple-700 to-pink-600 px-6 py-24 text-white">
      {/* Decorative Background Glows */}
      <div className="absolute -top-24 -left-20 h-72 w-72 rounded-full bg-indigo-500/30 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-20 h-72 w-72 rounded-full bg-pink-500/30 blur-3xl pointer-events-none" />

      <div className="relative mx-auto flex max-w-5xl flex-col items-center text-center">
        {/* Badge */}
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm font-medium backdrop-blur-md shadow-inner">
          <Sparkles className="h-4 w-4 text-yellow-300" />
          <span>Learn with confidence</span>
        </div>

        {/* Heading */}
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl leading-tight">
          Build practical skills with <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-amber-200 via-white to-pink-200 bg-clip-text text-transparent">
            world-class courses
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mt-6 max-w-2xl text-lg text-indigo-100 sm:text-xl leading-relaxed">
          Discover beginner-friendly, career-focused lessons that help you master in-demand technologies and grow faster.
        </p>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <a
            href="/courses"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-white px-7 py-3.5 text-base font-semibold text-indigo-950 shadow-lg hover:bg-slate-100 hover:scale-105 active:scale-95 transition-all duration-200"
          >
            <span>Explore Courses</span>
            <ArrowRight className="h-4 w-4 text-indigo-700" />
          </a>

          <button
            type="button"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-white/30 bg-white/10 px-7 py-3.5 text-base font-semibold text-white backdrop-blur-md hover:bg-white/20 hover:scale-105 active:scale-95 transition-all duration-200"
          >
            <PlayCircle className="h-5 w-5 text-pink-300" />
            <span>Watch Preview</span>
          </button>
        </div>

        {/* Stat Highlights */}
        <div className="mt-14 grid grid-cols-3 gap-6 pt-8 border-t border-white/15 w-full max-w-xl text-center">
          <div>
            <p className="text-2xl sm:text-3xl font-bold">10k+</p>
            <p className="text-xs sm:text-sm text-indigo-200 mt-1">Active Learners</p>
          </div>
          <div>
            <p className="text-2xl sm:text-3xl font-bold">100+</p>
            <p className="text-xs sm:text-sm text-indigo-200 mt-1">Expert Courses</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1 text-2xl sm:text-3xl font-bold">
              <span>4.8</span>
              <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
            </div>
            <p className="text-xs sm:text-sm text-indigo-200 mt-1">Avg Rating</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Banner;
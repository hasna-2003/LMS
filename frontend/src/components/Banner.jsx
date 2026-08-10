import React from "react";

const Banner = () => {
  return (
    <section className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 px-6 py-20 text-white">
      <div className="mx-auto flex max-w-6xl flex-col items-center text-center">
        <p className="mb-4 rounded-full border border-white/20 bg-white/10 px-4 py-1 text-sm backdrop-blur">
          Learn with confidence
        </p>
        <h1 className="text-4xl font-semibold sm:text-5xl">
          Build practical skills with world-class courses
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-indigo-100">
          Discover beginner-friendly, career-focused lessons that help you grow faster.
        </p>
      </div>
    </section>
  );
};

export default Banner;
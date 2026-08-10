import React from "react";
import Layout from "../components/Layout";
import courses from "../assets/dummyData";

const Courses = () => {
  return (
    <Layout>
      <div className="min-h-screen bg-slate-50 px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <h1 className="text-3xl font-semibold">All Courses</h1>
          <p className="mt-3 text-slate-600">Browse a growing library of practical classes for every learning stage.</p>
          <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {courses.map((course) => (
              <div key={course.id} className="rounded-3xl bg-white p-6 shadow-sm">
                <h2 className="font-semibold text-slate-800">{course.name}</h2>
                <p className="mt-2 text-sm text-slate-600">{course.teacher}</p>
                <p className="mt-4 text-sm text-slate-500">{course.overview}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Courses;

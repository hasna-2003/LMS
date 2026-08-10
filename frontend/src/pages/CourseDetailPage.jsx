import React from "react";
import { useParams } from "react-router-dom";
import courses from "../assets/dummyData";

const CourseDetailPage = () => {
  const { id } = useParams();
  const course = courses.find((item) => String(item.id) === String(id));

  if (!course) {
    return <div className="p-8">Course not found.</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <h1 className="text-3xl font-semibold">{course.name}</h1>
      <p className="mt-3 text-slate-600">{course.overview}</p>
    </div>
  );
};

export default CourseDetailPage;

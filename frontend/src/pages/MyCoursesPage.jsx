import React from "react";
import Layout from "../components/Layout";
import MyCourses from "../components/MyCourses";

const MyCoursesPage = () => {
  return (
    <Layout>
      <div className="min-h-screen bg-slate-50 p-8">
        <h1 className="text-3xl font-semibold mb-4">My Courses</h1>
        <MyCourses />
      </div>
    </Layout>
  );
};

export default MyCoursesPage;

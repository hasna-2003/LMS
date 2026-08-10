import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Faculty from "./pages/Faculty";
import Courses from "./pages/Courses";
import MyCoursesPage from "./pages/MyCoursesPage";
import CourseDetailPage from "./pages/CourseDetailPage";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/faculty" element={<Faculty />} />
      <Route path="/courses" element={<Courses />} />
      <Route path="/mycourses" element={<MyCoursesPage />} />
      <Route path="/course/:id" element={<CourseDetailPage />} />
    </Routes>
  );
};

export default App;
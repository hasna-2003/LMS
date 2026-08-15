import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Faculty from "./pages/Faculty";
import Courses from "./pages/Courses";
import MyCoursesPage from "./pages/MyCoursesPage";
import CourseDetailPage from "./pages/CourseDetailPage";
import AuthPage from "./pages/AuthPage";

const isAuthenticated = () => {
  try {
    return Boolean(localStorage.getItem("learnhub_session"));
  } catch {
    return false;
  }
};

const ProtectedRoute = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/login" replace />;
};

const App = () => {
  return (
    <Routes>
      <Route path="/login" element={<AuthPage mode="login" />} />
      <Route path="/register" element={<AuthPage mode="register" />} />
      <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
      <Route path="/about" element={<ProtectedRoute><About /></ProtectedRoute>} />
      <Route path="/contact" element={<ProtectedRoute><Contact /></ProtectedRoute>} />
      <Route path="/faculty" element={<ProtectedRoute><Faculty /></ProtectedRoute>} />
      <Route path="/courses" element={<ProtectedRoute><Courses /></ProtectedRoute>} />
      <Route path="/mycourses" element={<ProtectedRoute><MyCoursesPage /></ProtectedRoute>} />
      <Route path="/course/:id" element={<ProtectedRoute><CourseDetailPage /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default App;
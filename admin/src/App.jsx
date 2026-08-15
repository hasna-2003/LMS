import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Add from "./pages/Add";
import List from "./pages/List";
import Bookings from "./pages/Bookings";
import AuthPage from "./pages/AuthPage";

const isAuthenticated = () => {
  try {
    return Boolean(localStorage.getItem("learnhub_admin_session"));
  } catch {
    return false;
  }
};

const ProtectedRoute = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/login" replace />;
};

const App = () => {
  const authRequired = isAuthenticated();

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">
      {authRequired && <Navbar />}
      <main className={`${authRequired ? "w-full pt-20 px-4 sm:px-6 lg:px-8" : "w-full"}`}>
        <Routes>
          <Route path="/login" element={<AuthPage mode="login" />} />
          <Route path="/register" element={<AuthPage mode="register" />} />
          <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/addcourse" element={<ProtectedRoute><Add /></ProtectedRoute>} />
          <Route path="/listcourse" element={<ProtectedRoute><List /></ProtectedRoute>} />
          <Route path="/bookings" element={<ProtectedRoute><Bookings /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to={authRequired ? "/" : "/login"} replace />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;
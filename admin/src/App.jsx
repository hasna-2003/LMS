import React from "react";
import { Routes, Route } from "react-router-dom"; // Fixed import
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Add from "./pages/Add";
import List from "./pages/List";
import Bookings from "./pages/Bookings";

const App = () => {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">
      <Navbar />
      <main className="w-full pt-20 px-4 sm:px-6 lg:px-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/addcourse" element={<Add />} />
          <Route path="/listcourse" element={<List />} />
          <Route path="/bookings" element={<Bookings />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;
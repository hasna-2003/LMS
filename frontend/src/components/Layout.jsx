import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="pt-20">{children}</div>
      <Footer />
    </div>
  );
};

export default Layout;

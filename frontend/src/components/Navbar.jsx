import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const links = [
    { name: "Home", href: "/" },
    { name: "Courses", href: "/courses" },
    { name: "About", href: "/about" },
    { name: "Faculty", href: "/faculty" },
    { name: "Contact", href: "/contact" },
    { name: "My Courses", href: "/mycourses" },
  ];

  return (
    <nav className="fixed inset-x-0 top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link to="/" className="text-lg font-semibold text-slate-800">
          LearnHub
        </Link>
        <div className="flex items-center gap-4 text-sm text-slate-600">
          {links.map((link) => (
            <Link key={link.name} to={link.href} className="transition hover:text-indigo-600">
              {link.name}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
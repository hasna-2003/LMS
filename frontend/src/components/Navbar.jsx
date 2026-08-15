import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { GraduationCap, Menu, X, ArrowRight, User } from "lucide-react";

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const links = [
    { name: "Home", href: "/" },
    { name: "Courses", href: "/courses" },
    { name: "About", href: "/about" },
    { name: "Faculty", href: "/faculty" },
    { name: "Contact", href: "/contact" },
    { name: "My Courses", href: "/mycourses" },
  ];

  const handleSignOut = () => {
    localStorage.removeItem("learnhub_session");
    navigate("/login");
  };

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <nav className="fixed inset-x-0 top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur-md transition-all">
      <div className="mx-auto flex max-w-[1500px] items-center justify-between gap-2 px-4 sm:px-6 lg:px-8 h-16">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-200">
            <GraduationCap className="h-5 w-5" />
          </div>
          <span className="text-lg sm:text-xl font-bold tracking-tight text-slate-900">
            Learn<span className="text-indigo-600">Hub</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-0.5 lg:gap-1">
          {links.map((link) => {
            const isActive = location.pathname === link.href;
            return (
              <Link
                key={link.name}
                to={link.href}
                className={`px-2.5 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                  isActive
                    ? "text-indigo-600 bg-indigo-50/80 font-semibold"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80"
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </div>

        <div className="hidden md:flex items-center gap-1.5">
          <button
            onClick={handleSignOut}
            className="inline-flex items-center gap-1.5 px-2.5 py-2 text-sm font-medium text-slate-700 hover:text-indigo-600 transition-colors rounded-lg hover:bg-slate-100"
          >
            <User className="h-4 w-4" />
            <span>Sign Out</span>
          </button>
          <Link
            to="/register"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm hover:shadow-md hover:shadow-indigo-200 transition-all active:scale-95"
          >
            <span>Get Started</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white/95 backdrop-blur-md px-4 pt-2 pb-6 space-y-2 animate-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col space-y-1 py-2">
            {links.map((link) => {
              const isActive = location.pathname === link.href;
              return (
                <Link
                  key={link.name}
                  to={link.href}
                  className={`px-3 py-2.5 text-base font-medium rounded-lg transition-colors ${
                    isActive
                      ? "text-indigo-600 bg-indigo-50 font-semibold"
                      : "text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>

          <div className="pt-4 border-t border-slate-100 flex flex-col gap-2">
            <button
              onClick={handleSignOut}
              className="w-full py-2.5 text-center text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Sign Out
            </button>
            <Link
              to="/register"
              className="w-full py-2.5 text-center text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md transition-all"
            >
              Get Started
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
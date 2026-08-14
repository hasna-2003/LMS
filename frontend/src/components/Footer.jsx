import React from "react";
import { Link } from "react-router-dom";
import { 
  BookOpen, 
  GraduationCap, 
  Globe2, 
  Mail, 
  Phone, 
  MapPin, 
  Send,
  Sparkles,
  ArrowRight
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t border-slate-800 bg-slate-950 text-slate-200">
      {/* Top Main Section */}
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 sm:px-8 md:grid-cols-2 lg:grid-cols-4">
        
        {/* Brand Column */}
        <div className="space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/20">
              <GraduationCap className="h-5 w-5" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">
              Learn<span className="text-indigo-400">Hub</span>
            </span>
          </div>
          <p className="text-sm leading-relaxed text-slate-400">
            Empowering ambitious learners across Sri Lanka with practical, high-impact skills for real-world career growth.
          </p>
          <div className="flex items-center gap-2 pt-2 text-xs font-medium text-indigo-400">
            <Sparkles className="h-4 w-4" />
            <span>Over 10,000+ Active Students</span>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wider text-white">
            Quick Links
          </h4>
          <ul className="mt-4 space-y-2.5 text-sm text-slate-400">
            {[
              { label: "All Courses", path: "/courses" },
              { label: "About Us", path: "/about" },
              { label: "Become an Instructor", path: "/teach" },
              { label: "Contact", path: "/contact" },
            ].map((link, idx) => (
              <li key={idx}>
                <Link
                  to={link.path}
                  className="inline-flex items-center gap-1.5 transition-colors hover:text-indigo-400"
                >
                  <ArrowRight className="h-3 w-3 opacity-0 transition-all group-hover:opacity-100" />
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Sri Lankan Contact Info */}
        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wider text-white">
            Get in Touch
          </h4>
          <ul className="mt-4 space-y-3 text-sm text-slate-400">
            <li className="flex items-start gap-3">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-indigo-400" />
              <span>Level 5, Galle Road, Colombo 03, Sri Lanka</span>
            </li>
            <li className="flex items-center gap-3">
              <Phone className="h-4 w-4 shrink-0 text-indigo-400" />
              <a href="tel:+94112345678" className="transition-colors hover:text-white">
                +94 11 234 5678
              </a>
            </li>
            <li className="flex items-center gap-3">
              <Mail className="h-4 w-4 shrink-0 text-indigo-400" />
              <a href="mailto:hello@learnhub.lk" className="transition-colors hover:text-white">
                hello@learnhub.lk
              </a>
            </li>
          </ul>
        </div>

        {/* Newsletter Signup */}
        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wider text-white">
            Stay Updated
          </h4>
          <p className="mt-4 text-xs leading-relaxed text-slate-400">
            Subscribe to receive new course updates and exclusive discount vouchers.
          </p>
          <form onSubmit={(e) => e.preventDefault()} className="mt-3 flex items-center gap-2">
            <div className="relative flex-1">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full rounded-lg border border-slate-800 bg-slate-900 px-3.5 py-2 text-xs text-white placeholder-slate-500 transition-colors focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-3.5 py-2 text-xs font-semibold text-white shadow-md transition-all hover:bg-indigo-500 hover:shadow-indigo-500/20 active:scale-95"
            >
              <Send className="h-3.5 w-3.5" />
            </button>
          </form>
        </div>

      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-900 bg-slate-950/80 px-6 py-5 text-xs text-slate-500">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 sm:flex-row">
          <span>© {new Date().getFullYear()} LearnHub LK. All rights reserved.</span>
          
          {/* Social Icons / Features */}
          <div className="flex items-center gap-4">
            <a
              href="#"
              aria-label="Courses"
              className="rounded-lg p-1.5 transition-colors hover:bg-slate-900 hover:text-indigo-400"
            >
              <BookOpen className="h-4 w-4" />
            </a>
            <a
              href="#"
              aria-label="Education"
              className="rounded-lg p-1.5 transition-colors hover:bg-slate-900 hover:text-indigo-400"
            >
              <GraduationCap className="h-4 w-4" />
            </a>
            <a
              href="#"
              aria-label="Global Reach"
              className="rounded-lg p-1.5 transition-colors hover:bg-slate-900 hover:text-indigo-400"
            >
              <Globe2 className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
import React from "react";
import { BookOpen, GraduationCap, Globe2, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t border-slate-200 bg-slate-900 text-slate-200">
      <div className="mx-auto grid max-w-6xl gap-8 px-6 py-10 md:grid-cols-3">
        <div>
          <h3 className="text-lg font-semibold">LearnHub</h3>
          <p className="mt-3 text-sm text-slate-400">
            Practical courses for ambitious learners who want to build real-world skills.
          </p>
        </div>
        <div>
          <h4 className="font-semibold">Quick Links</h4>
          <ul className="mt-3 space-y-2 text-sm text-slate-400">
            <li>Courses</li>
            <li>About</li>
            <li>Contact</li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold">Contact</h4>
          <div className="mt-3 space-y-2 text-sm text-slate-400">
            <p className="flex items-center gap-2"><Mail size={16} /> hello@learnhub.com</p>
            <p className="flex items-center gap-2"><Phone size={16} /> +91 82994 31275</p>
            <p className="flex items-center gap-2"><MapPin size={16} /> Bengaluru, India</p>
          </div>
        </div>
      </div>
      <div className="border-t border-slate-800 px-6 py-4 text-center text-sm text-slate-500">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <span>© 2026 LearnHub</span>
          <div className="flex gap-3">
            <BookOpen size={16} />
            <GraduationCap size={16} />
            <Globe2 size={16} />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
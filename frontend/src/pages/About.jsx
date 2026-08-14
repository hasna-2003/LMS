import React from "react";
import { Link } from "react-router-dom";
import Layout from "../components/Layout";
import { 
  Code2, 
  Clock, 
  Users, 
  Target, 
  Award, 
  Briefcase, 
  ArrowRight,
  CheckCircle2,
  Sparkles
} from "lucide-react";

const About = () => {
  const stats = [
    { label: "Active Students", value: "10,000+" },
    { label: "Practical Courses", value: "120+" },
    { label: "Expert Instructors", value: "45+" },
    { label: "Career Success Rate", value: "94%" },
  ];

  const features = [
    {
      icon: Code2,
      title: "Practical, Project-Based Learning",
      text: "Master real-world tools, frameworks, and workflows that top Sri Lankan and global tech employers actively demand.",
    },
    {
      icon: Clock,
      title: "Flexible & Self-Paced Access",
      text: "Study on your schedule. Lifetime access to lectures and exercise files lets you learn without compromising your work.",
    },
    {
      icon: Users,
      title: "Supportive Sri Lankan Community",
      text: "Connect with local mentors, experienced instructors, and ambitious peers via dedicated discussion forums.",
    },
    {
      icon: Target,
      title: "Industry-Aligned Curriculum",
      text: "Our modules are updated quarterly in partnership with tech leaders to keep pace with changing industry standards.",
    },
    {
      icon: Award,
      title: "Recognized Certifications",
      text: "Earn verified certificates upon completion to showcase your skills on LinkedIn and job applications.",
    },
    {
      icon: Briefcase,
      title: "Career & Interview Support",
      text: "Get actionable feedback on resumes, GitHub portfolios, and technical interviews to land your target role.",
    },
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-slate-50/60 py-12 md:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 space-y-16">
          
          {/* Hero Section */}
          <section className="relative rounded-3xl bg-white border border-slate-200/80 p-8 sm:p-12 md:p-16 shadow-sm overflow-hidden text-center md:text-left">
            <div className="absolute top-0 right-0 -mt-12 -mr-12 h-64 w-64 rounded-full bg-indigo-50/60 blur-3xl pointer-events-none" />
            
            <div className="relative max-w-3xl space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3.5 py-1.5 text-xs font-semibold text-indigo-600 border border-indigo-100">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Empowering Sri Lanka's Next Tech Leaders</span>
              </div>
              
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
                About <span className="text-indigo-600">LearnHub</span>
              </h1>
              
              <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
                LearnHub is a modern learning platform built to bridge the gap between academic theory and real-world tech careers. We empower developers, designers, and innovators with high-impact skills designed for long-term career success.
              </p>
            </div>

            {/* Stats Row */}
            <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-4 border-t border-slate-100 pt-8">
              {stats.map((stat, idx) => (
                <div key={idx} className="text-center md:text-left">
                  <div className="text-2xl sm:text-3xl font-black text-slate-900">
                    {stat.value}
                  </div>
                  <div className="text-xs sm:text-sm font-medium text-slate-500 mt-1">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Mission & Vision Grid */}
          <section className="grid gap-8 md:grid-cols-2">
            <div className="rounded-3xl bg-white border border-slate-200/80 p-8 shadow-sm space-y-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 font-bold">
                01
              </div>
              <h2 className="text-xl font-bold text-slate-900">Our Mission</h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                To provide accessible, high-quality practical education that enables anyone, anywhere in Sri Lanka to learn modern technology stack and build meaningful digital products.
              </p>
            </div>

            <div className="rounded-3xl bg-white border border-slate-200/80 p-8 shadow-sm space-y-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600 font-bold">
                02
              </div>
              <h2 className="text-xl font-bold text-slate-900">Our Vision</h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                To cultivate Sri Lanka’s most vibrant ecosystem of self-driven learners and skilled professionals who contribute to local tech innovation and global opportunities.
              </p>
            </div>
          </section>

          {/* Core Pillars / Features Grid */}
          <section className="space-y-8">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                Why Learn With Us?
              </h2>
              <p className="text-sm text-slate-600">
                Everything you need to master new tools and advance your technical capabilities.
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((item, index) => {
                const IconComponent = item.icon;
                return (
                  <div
                    key={index}
                    className="group rounded-2xl bg-white border border-slate-200/80 p-6 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all duration-200"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-200 mb-4">
                      <IconComponent className="h-5 w-5" />
                    </div>
                    <h3 className="font-bold text-slate-900 text-base mb-2">
                      {item.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {item.text}
                    </p>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Call to Action Banner */}
          <section className="rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-8 sm:p-12 text-center text-white shadow-xl">
            <div className="max-w-2xl mx-auto space-y-6">
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
                Ready to Boost Your Skills?
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                Explore our growing catalog of practical courses in web development, design, cloud infrastructure, and data science.
              </p>
              <div className="pt-2">
                <Link
                  to="/courses"
                  className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3.5 text-sm font-semibold text-white shadow-md hover:bg-indigo-500 transition-all duration-200 active:scale-95"
                >
                  <span>Browse All Courses</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </section>

        </div>
      </div>
    </Layout>
  );
};

export default About;
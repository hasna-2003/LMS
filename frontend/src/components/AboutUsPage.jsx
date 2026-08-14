import React, { useState, useEffect } from "react";
import { ShieldCheck as ShieldUser, Star } from "lucide-react";

// Target numbers for the animated counter
const counterTargets = {
  students: 15000,
  courses: 120,
  successRate: 98,
  countries: 45,
  certificates: 10000,
  support: 24,
};

// Values & Principles Data
const values = [
  {
    title: "Excellence in Education",
    description: "We are committed to providing top-tier, industry-relevant learning experiences.",
    color: "bg-blue-500 text-blue-500",
    features: ["Industry Experts", "Updated Curriculum", "Hands-on Projects"],
  },
  {
    title: "Student Centricity",
    description: "Our learners' growth, success, and experience drive every decision we make.",
    color: "bg-emerald-500 text-emerald-500",
    features: ["1-on-1 Mentorship", "24/7 Community", "Career Guidance"],
  },
  {
    title: "Continuous Innovation",
    description: "Constantly evolving our teaching methods with cutting-edge tools and trends.",
    color: "bg-purple-500 text-purple-500",
    features: ["Interactive Labs", "AI Assisted Tools", "Real-world Applications"],
  },
];

// Student Testimonials Data
const testimonials = [
  {
    name: "Sarah Jenkins",
    role: "Full-Stack Developer",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150",
    rating: 5,
    text: "The structured curriculum and supportive mentors enabled me to switch careers into tech within 6 months!",
  },
  {
    name: "Michael Chen",
    role: "Data Analyst",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150",
    rating: 5,
    text: "Clear, practical, and highly relevant. The hands-on projects gave me real confidence for technical interviews.",
  },
];

// Tailwind Style Dictionary Fallback
const aboutUsStyles = {
  heroVignette: "absolute inset-0 pointer-events-none z-10",
  valuesSection: "py-16 bg-white",
  sectionGrid: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",
  valuesHeader: "text-center max-w-3xl mx-auto mb-12",
  valuesBadge: "inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-sm font-medium mb-4",
  valuesBadgeIcon: "w-4 h-4",
  valuesBadgeText: "font-semibold",
  valuesTitle: "text-3xl font-bold text-gray-900 sm:text-4xl",
  valuesSubtitle: "text-lg text-gray-600 mt-2",
  valuesGrid: "grid grid-cols-1 md:grid-cols-3 gap-8",
  valueCard: "relative bg-slate-50 rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col justify-between",
  valueGradient: "absolute top-0 left-0 w-full h-1 opacity-80",
  valueCardTitle: "text-xl font-bold text-gray-900 mb-3 mt-2",
  valueCardDescription: "text-gray-600 text-sm mb-6 leading-relaxed",
  valueFeatures: "space-y-2 mb-6",
  valueFeatureItem: "flex items-center text-sm text-gray-700 gap-2",
  valueFeatureDot: "w-2 h-2 rounded-full",
  valueUnderline: "h-0.5 w-12 rounded-full mt-auto",
  testimonialsSection: "py-16 bg-slate-50 border-t border-slate-200/60",
  testimonialsHeader: "text-center max-w-3xl mx-auto mb-12",
  testimonialsTitle: "text-3xl font-bold text-gray-900 sm:text-4xl",
  testimonialsSubtitle: "text-lg text-gray-600 mt-2",
  testimonialsGrid: "grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto",
  testimonialCard: "bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between",
  testimonialStars: "flex gap-1 text-yellow-400 mb-4",
  testimonialStar: "w-5 h-5 fill-yellow-400",
  testimonialText: "text-gray-700 italic text-base mb-6 leading-relaxed",
  testimonialAuthor: "flex items-center gap-4",
  testimonialAvatar: "w-12 h-12 rounded-full object-cover border border-slate-200",
  testimonialAuthorName: "font-bold text-gray-900 text-sm",
  testimonialAuthorRole: "text-gray-500 text-xs",
};

const AboutUsPage = () => {
  const [counterValues, setCounterValues] = useState({
    students: 0,
    courses: 0,
    successRate: 0,
    countries: 0,
    certificates: 0,
    support: 0,
  });

  // Animated counter effect using counterTargets
  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const stepDuration = duration / steps;
    const timers = [];

    Object.keys(counterTargets).forEach((key) => {
      let current = 0;
      const target = counterTargets[key];
      const increment = target / steps;

      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          current = target;
          clearInterval(timer);
        }
        setCounterValues((prev) => ({
          ...prev,
          [key]: Math.floor(current),
        }));
      }, stepDuration);

      timers.push(timer);
    });

    return () => timers.forEach((t) => clearInterval(t));
  }, []);

  // Helper to format display number per stat key
  const formatStatNumber = (key) => {
    if (key === "support") return "24/7";
    if (key === "successRate") return `${counterValues.successRate}%`;
    const val = counterValues[key] ?? 0;
    return `${val.toLocaleString()}+`;
  };

  return (
    <div className="relative min-h-screen">
      {/* Top-and-bottom vignette */}
      <div
        className={aboutUsStyles.heroVignette}
        style={{
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.0) 30%, rgba(0,0,0,0.0) 70%, rgba(0,0,0,0.72) 100%)",
        }}
      />

      {/* Stats Counter Display Banner */}
      <section className="bg-slate-900 text-white py-12">
        <div className={aboutUsStyles.sectionGrid}>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 text-center">
            {Object.keys(counterTargets).map((key) => (
              <div key={key} className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
                <div className="text-2xl lg:text-3xl font-extrabold text-blue-400">
                  {formatStatNumber(key)}
                </div>
                <div className="text-xs lg:text-sm text-slate-400 capitalize mt-1">
                  {key.replace(/([A-Z])/g, " $1")}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Values Principles Section */}
      <section className={aboutUsStyles.valuesSection}>
        <div className={aboutUsStyles.sectionGrid}>
          <div className={aboutUsStyles.valuesHeader}>
            <div className={aboutUsStyles.valuesBadge}>
              <ShieldUser className={aboutUsStyles.valuesBadgeIcon} />
              <span className={aboutUsStyles.valuesBadgeText}>
                Our Guiding Principles
              </span>
            </div>
            <h2 className={aboutUsStyles.valuesTitle}>
              Core Values That Define Us
            </h2>
            <p className={aboutUsStyles.valuesSubtitle}>
              The foundation of everything we do at LearnHub
            </p>
          </div>

          <div className={aboutUsStyles.valuesGrid}>
            {values.map((value, index) => (
              <div key={index} className={aboutUsStyles.valueCard}>
                <div
                  className={`${aboutUsStyles.valueGradient} ${value.color}`}
                ></div>

                <h3
                  className={aboutUsStyles.valueCardTitle}
                  title={value.title}
                >
                  {value.title}
                </h3>

                <p className={aboutUsStyles.valueCardDescription}>
                  {value.description}
                </p>

                <ul className={aboutUsStyles.valueFeatures}>
                  {value.features.map((feature, featureIndex) => (
                    <li
                      key={featureIndex}
                      className={aboutUsStyles.valueFeatureItem}
                    >
                      <div
                        className={`${aboutUsStyles.valueFeatureDot} ${value.color}`}
                      ></div>
                      {feature}
                    </li>
                  ))}
                </ul>

                <div
                  className={`${aboutUsStyles.valueUnderline} ${value.color}`}
                ></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className={aboutUsStyles.testimonialsSection}>
        <div className={aboutUsStyles.sectionGrid}>
          <div className={aboutUsStyles.testimonialsHeader}>
            <h2 className={aboutUsStyles.testimonialsTitle}>
              What Our Students Say
            </h2>
            <p className={aboutUsStyles.testimonialsSubtitle}>
              Real stories from real learners who transformed their careers
            </p>
          </div>
          <div className={aboutUsStyles.testimonialsGrid}>
            {testimonials.map((testimonial, index) => (
              <div key={index} className={aboutUsStyles.testimonialCard}>
                <div className={aboutUsStyles.testimonialStars}>
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className={aboutUsStyles.testimonialStar} />
                  ))}
                </div>
                <p className={aboutUsStyles.testimonialText}>
                  "{testimonial.text}"
                </p>
                <div className={aboutUsStyles.testimonialAuthor}>
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className={aboutUsStyles.testimonialAvatar}
                  />
                  <div>
                    <div className={aboutUsStyles.testimonialAuthorName}>
                      {testimonial.name}
                    </div>
                    <div className={aboutUsStyles.testimonialAuthorRole}>
                      {testimonial.role}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUsPage;
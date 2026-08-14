import React, { useEffect, useRef } from "react";
import { Quote, Star, Award, CheckCircle2 } from "lucide-react";

// Mock Testimonial Data
const testimonialsData = [
  {
    id: 1,
    name: "Alex Rivera",
    role: "Frontend Engineer at TechCorp",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
    rating: 5,
    course: "React & Next.js Masterclass",
    text: "The practical projects transformed how I construct frontend architecture. The step-by-step guidance made complex state management feel intuitive.",
  },
  {
    id: 2,
    name: "Sophia Chen",
    role: "Product Designer",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=200",
    rating: 5,
    course: "UI/UX Design Systems",
    text: "An absolute game-changer. I was able to build a cohesive design system for my team within weeks of finishing this course.",
  },
  {
    id: 3,
    name: "Marcus Vance",
    role: "Backend Developer",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200",
    rating: 4.8,
    course: "Node.js & PostgreSQL",
    text: "Hands down the best resource for learning server-side programming. The real-world API security section alone was worth every penny.",
  },
];

// Tailored CSS Style Dictionary
const testimonialStyles = {
  section: "py-20 bg-slate-900 text-white overflow-hidden relative",
  container: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",
  header: "text-center max-w-3xl mx-auto mb-16",
  badge: "inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-semibold mb-4",
  title: "text-3xl sm:text-5xl font-extrabold tracking-tight text-white",
  subtitle: "mt-4 text-slate-400 text-base sm:text-lg",
  grid: "grid grid-cols-1 md:grid-cols-3 gap-8 perspective-1000",
  card: "relative bg-slate-800/80 border border-slate-700/60 rounded-3xl p-8 backdrop-blur-md shadow-xl transition-all duration-200 opacity-0 translate-y-6 [&.card-visible]:opacity-100 [&.card-visible]:translate-y-0 transform-gpu",
  quoteIcon: "quote-icon absolute top-6 right-6 text-indigo-500/20 w-12 h-12 pointer-events-none transition-transform duration-100 ease-out",
  courseBadge: "course-badge inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-indigo-600/20 text-indigo-300 text-xs font-medium mb-6 border border-indigo-500/30 transition-transform duration-100 ease-out",
  text: "text-slate-300 text-sm leading-relaxed mb-8 relative z-10",
  footer: "flex items-center gap-4 pt-6 border-t border-slate-700/50 mt-auto",
  avatarContainer: "avatar-container relative w-12 h-12 rounded-full overflow-hidden border-2 border-indigo-500/40 shrink-0 transition-transform duration-100 ease-out",
  avatar: "w-full h-full object-cover",
  authorName: "font-bold text-white text-base leading-snug",
  authorRole: "text-xs text-slate-400 font-medium",
  starsContainer: "flex items-center gap-1 mb-3",
  star: "w-4 h-4 transition-colors",
  starActive: "text-amber-400 fill-amber-400",
  starInactive: "text-slate-600 fill-slate-600",
};

const Testimonials = () => {
  const cardsRef = useRef([]);

  // Helper to test if device supports fine pointer (mouse)
  const isPointerDevice = () =>
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(pointer:fine)").matches;

  // Enhanced 3D tilt with parallax layers
  const onMouseMove = (e, el) => {
    if (!el || !isPointerDevice()) return;

    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    const px = (x - 0.5) * 2;
    const py = (y - 0.5) * 2;

    const rotateMax = 10;
    const translateMax = 8;

    const rx = -py * rotateMax;
    const ry = px * rotateMax;
    const tx = px * translateMax;
    const ty = py * translateMax;

    // Main card transform
    el.style.transform = `perspective(1200px) rotateX(${rx}deg) rotateY(${ry}deg) translate3d(${tx}px, ${ty}px, 0)`;

    // Parallax effects for inner elements
    const avatar = el.querySelector(".avatar-container");
    const quote = el.querySelector(".quote-icon");
    const badge = el.querySelector(".course-badge");

    if (avatar) {
      avatar.style.transform = `translate3d(${tx * 0.3}px, ${ty * 0.3}px, 20px)`;
    }
    if (quote && window.innerWidth >= 640) {
      quote.style.transform = `translate3d(${tx * 0.5}px, ${ty * 0.5}px, 40px) rotate(${ry * 2}deg)`;
    }
    if (badge) {
      badge.style.transform = `translate3d(${tx * 0.2}px, ${ty * 0.2}px, 30px)`;
    }
  };

  const onMouseLeave = (el) => {
    if (!el || !isPointerDevice()) return;

    el.style.transform = `perspective(1200px) rotateX(0deg) rotateY(0deg) translate3d(0,0,0)`;
    el.style.transition = "transform 600ms cubic-bezier(.23,1,.32,1)";

    // Reset parallax elements
    const avatar = el.querySelector(".avatar-container");
    const quote = el.querySelector(".quote-icon");
    const badge = el.querySelector(".course-badge");

    [avatar, quote, badge].forEach((element) => {
      if (element) {
        element.style.transform = "translate3d(0,0,0)";
        element.style.transition = "transform 600ms cubic-bezier(.23,1,.32,1)";
      }
    });

    setTimeout(() => {
      if (el) el.style.transition = "";
      [avatar, quote, badge].forEach((element) => {
        if (element) element.style.transition = "";
      });
    }, 650);
  };

  // Intersection Observer for scroll animation
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((en, index) => {
          if (en.isIntersecting) {
            setTimeout(() => {
              en.target.classList.add("card-visible");
            }, index * 150);
            obs.unobserve(en.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    cardsRef.current.forEach((c) => {
      if (c) obs.observe(c);
    });

    return () => obs.disconnect();
  }, []);

  // Helper to render star rating SVGs
  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <svg
        key={i}
        className={`${testimonialStyles.star} ${
          i < Math.floor(rating)
            ? testimonialStyles.starActive
            : testimonialStyles.starInactive
        }`}
        viewBox="0 0 24 24"
      >
        <path d="M12 .587l3.668 7.431L24 9.748l-6 5.847L19.335 24 12 19.897 4.665 24 6 15.595 0 9.748l8.332-1.73z" />
      </svg>
    ));
  };

  return (
    <section className={testimonialStyles.section}>
      <div className={testimonialStyles.container}>
        {/* Header */}
        <div className={testimonialStyles.header}>
          <div className={testimonialStyles.badge}>
            <Award className="w-4 h-4 text-indigo-400" />
            <span>Student Stories</span>
          </div>
          <h2 className={testimonialStyles.title}>
            Trusted by Thousands of Learners Worldwide
          </h2>
          <p className={testimonialStyles.subtitle}>
            Discover how our practical curriculum helped students elevate their careers and build impactful products.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className={testimonialStyles.grid}>
          {testimonialsData.map((item, index) => (
            <article
              key={item.id}
              ref={(el) => (cardsRef.current[index] = el)}
              onMouseMove={(e) => onMouseMove(e, cardsRef.current[index], index)}
              onMouseLeave={() => onMouseLeave(cardsRef.current[index])}
              className={testimonialStyles.card}
              style={{ transformStyle: "preserve-3d" }}
            >
              {/* Background Quote Icon */}
              <Quote className={testimonialStyles.quoteIcon} />

              {/* Course Badge */}
              <div className={testimonialStyles.courseBadge}>
                <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />
                <span>{item.course}</span>
              </div>

              {/* Star Ratings */}
              <div className={testimonialStyles.starsContainer}>
                {renderStars(item.rating)}
              </div>

              {/* Review Text */}
              <p className={testimonialStyles.text}>"{item.text}"</p>

              {/* Author Footer */}
              <div className={testimonialStyles.footer}>
                <div className={testimonialStyles.avatarContainer}>
                  <img
                    src={item.avatar}
                    alt={item.name}
                    className={testimonialStyles.avatar}
                  />
                </div>
                <div>
                  <h3 className={testimonialStyles.authorName}>{item.name}</h3>
                  <p className={testimonialStyles.authorRole}>{item.role}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
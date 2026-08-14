import React, { useState } from "react";
import Layout from "../components/Layout";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  MessageSquare,
  CheckCircle2,
  HelpCircle,
  Sparkles,
} from "lucide-react";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "Course Inquiry",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API request delay
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      setFormData({
        name: "",
        email: "",
        subject: "Course Inquiry",
        message: "",
      });
    }, 1200);
  };

  const contactDetails = [
    {
      icon: Mail,
      title: "Email Us",
      value: "hello@learnhub.lk",
      link: "mailto:hello@learnhub.lk",
      subtitle: "Our team typically responds within 24 hours.",
    },
    {
      icon: Phone,
      title: "Call Us",
      value: "+94 11 234 5678",
      link: "tel:+94112345678",
      subtitle: "Mon - Fri, 8:30 AM to 5:30 PM (IST)",
    },
    {
      icon: MapPin,
      title: "Visit Our Hub",
      value: "Colombo 03, Sri Lanka",
      link: "#",
      subtitle: "Level 5, Galle Road, Colombo 03",
    },
    {
      icon: Clock,
      title: "Support Hours",
      value: "Monday – Saturday",
      link: "#",
      subtitle: "Student support desk active 9:00 AM – 7:00 PM",
    },
  ];

  const faqs = [
    {
      q: "How fast do I get access after enrolling in a course?",
      a: "Instantly! Once your payment is confirmed, all video lectures and resources become available in your account immediately.",
    },
    {
      q: "Can I get a refund if the course isn't right for me?",
      a: "Yes, we offer a 7-day money-back guarantee on all paid individual courses if you've completed less than 20% of the content.",
    },
    {
      q: "Do you offer group or corporate discounts in Sri Lanka?",
      a: "Yes, we provide custom packages for software teams, university student batches, and tech companies. Contact us via the form for details.",
    },
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-slate-50/60 py-12 md:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 space-y-16">
          {/* Header Section */}
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3.5 py-1.5 text-xs font-semibold text-indigo-600 border border-indigo-100">
              <Sparkles className="h-3.5 w-3.5" />
              <span>We're Here to Help</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Get in Touch with <span className="text-indigo-600">LearnHub</span>
            </h1>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Have questions about a course, batch availability, or platform support? Drop us a message and our Sri Lankan team will assist you.
            </p>
          </div>

          {/* Contact Details Grid */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {contactDetails.map((item, index) => {
              const IconComponent = item.icon;
              return (
                <div
                  key={index}
                  className="rounded-2xl bg-white border border-slate-200/80 p-6 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all duration-200 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                      <IconComponent className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
                        {item.title}
                      </h3>
                      {item.link !== "#" ? (
                        <a
                          href={item.link}
                          className="text-base font-bold text-slate-900 hover:text-indigo-600 transition-colors mt-0.5 block"
                        >
                          {item.value}
                        </a>
                      ) : (
                        <p className="text-base font-bold text-slate-900 mt-0.5">
                          {item.value}
                        </p>
                      )}
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 mt-4 border-t border-slate-100 pt-3">
                    {item.subtitle}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Main Form & Interactive Card Grid */}
          <div className="grid gap-10 md:grid-cols-12 items-start">
            {/* Form Column */}
            <div className="md:col-span-7 rounded-3xl bg-white border border-slate-200/80 p-6 sm:p-10 shadow-sm">
              <div className="flex items-center gap-2 mb-6">
                <MessageSquare className="h-5 w-5 text-indigo-600" />
                <h2 className="text-xl font-bold text-slate-900">Send Us a Message</h2>
              </div>

              {submitted ? (
                <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-6 text-center space-y-3">
                  <CheckCircle2 className="h-10 w-10 text-emerald-600 mx-auto" />
                  <h3 className="text-lg font-bold text-emerald-900">Message Sent Successfully!</h3>
                  <p className="text-xs sm:text-sm text-emerald-700 leading-relaxed max-w-md mx-auto">
                    Thank you for reaching out. One of our course advisors will get back to your email within 24 hours.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="mt-2 inline-flex items-center text-xs font-semibold text-emerald-800 hover:underline"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    {/* Name Input */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Your Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Kasun Perera"
                        className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                      />
                    </div>

                    {/* Email Input */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Email Address
                      </label>
                      <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="kasun@example.com"
                        className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                      />
                    </div>
                  </div>

                  {/* Subject Dropdown */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Subject
                    </label>
                    <select
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-sm text-slate-900 focus:bg-white focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                    >
                      <option value="Course Inquiry">Course Inquiry / Syllabus Details</option>
                      <option value="Enrollment Support">Enrollment & Payment Support</option>
                      <option value="Corporate Training">Corporate / Group Training</option>
                      <option value="Instructor Partnership">Become an Instructor</option>
                      <option value="General Feedback">General Feedback</option>
                    </select>
                  </div>

                  {/* Message Input */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Your Message
                    </label>
                    <textarea
                      name="message"
                      rows={5}
                      required
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Hi LearnHub, I'd like to ask about..."
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all resize-none"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-md hover:bg-indigo-700 hover:shadow-indigo-200 transition-all active:scale-[0.99] disabled:opacity-70"
                  >
                    {isSubmitting ? (
                      <span>Sending Message...</span>
                    ) : (
                      <>
                        <span>Send Message</span>
                        <Send className="h-4 w-4" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>

            {/* Sidebar FAQ Column */}
            <div className="md:col-span-5 space-y-6">
              <div className="rounded-3xl bg-white border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-6">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
                  <HelpCircle className="h-5 w-5 text-indigo-600" />
                  <h2 className="text-lg font-bold text-slate-900">Frequently Asked Questions</h2>
                </div>

                <div className="space-y-4">
                  {faqs.map((faq, idx) => (
                    <div key={idx} className="space-y-1.5">
                      <h3 className="text-sm font-bold text-slate-900 flex items-start gap-2">
                        <span className="text-indigo-600 font-mono">Q.</span>
                        {faq.q}
                      </h3>
                      <p className="text-xs text-slate-600 leading-relaxed pl-5">
                        {faq.a}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Info Box */}
              <div className="rounded-2xl bg-gradient-to-br from-slate-900 to-indigo-950 p-6 text-white shadow-md space-y-2">
                <h3 className="text-base font-bold">Are you an Instructor?</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  We are always looking for passionate industry experts in Sri Lanka to share their knowledge. Join our teaching faculty today.
                </p>
                <a
                  href="mailto:teach@learnhub.lk"
                  className="inline-block text-xs font-semibold text-indigo-400 hover:underline pt-2"
                >
                  Apply to teach &rarr;
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Contact;
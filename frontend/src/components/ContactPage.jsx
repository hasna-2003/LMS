import React, { useState } from "react";
import { User, Mail, Phone, MessageSquare, FileText, Send, Loader2 } from "lucide-react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

// Mock/Fallback Styles for contactStyles
const contactStyles = {
  container: "max-w-6xl mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center",
  formContainer: "bg-white p-8 rounded-2xl shadow-xl border border-slate-100",
  formElements: "space-y-6",
  formGroup: "flex flex-col gap-2",
  label: "flex items-center gap-2 text-sm font-semibold text-slate-700",
  labelIcon: "w-4 h-4",
  input: "w-full px-4 py-3 rounded-xl border border-slate-200 outline-none transition-all duration-200 focus:ring-2",
  select: "w-full px-4 py-3 rounded-xl border border-slate-200 outline-none transition-all duration-200 focus:ring-2 bg-white",
  textarea: "w-full px-4 py-3 rounded-xl border border-slate-200 outline-none transition-all duration-200 focus:ring-2 min-h-[120px] resize-y",
  inputError: "border-red-500 focus:ring-red-200",
  errorText: "text-xs text-red-500 mt-1",
  submitBtn: "w-full py-4 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2",
  colors: {
    blue: { icon: "text-blue-500", focus: "focus:border-blue-500 focus:ring-blue-100" },
    sky: { icon: "text-sky-500", focus: "focus:border-sky-500 focus:ring-sky-100" },
    green: { icon: "text-emerald-500", focus: "focus:border-emerald-500 focus:ring-emerald-100", hover: "hover:border-emerald-300" },
    purple: { icon: "text-purple-500", focus: "focus:border-purple-500 focus:ring-purple-100" },
    amber: { icon: "text-amber-500", focus: "focus:border-amber-500 focus:ring-amber-100" },
  },
  animationContainer: "flex items-center justify-center p-4",
  animationWrapper: "w-full max-w-lg",
};

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [phoneError, setPhoneError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Phone Validation Regex (Exactly 10 digits)
  const validatePhone = (phone) => /^\d{10}$/.test(phone);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Handle 10-digit strict numeric input for phone
    if (name === "phone") {
      const numericVal = value.replace(/\D/g, "").slice(0, 10);
      setFormData((prev) => ({ ...prev, phone: numericVal }));

      if (numericVal.length > 0 && !validatePhone(numericVal)) {
        setPhoneError("Phone number must be exactly 10 digits.");
      } else {
        setPhoneError("");
      }
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const isFormValid =
    formData.name.trim() !== "" &&
    formData.email.trim() !== "" &&
    validatePhone(formData.phone) &&
    formData.subject !== "" &&
    formData.message.trim() !== "";

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!isFormValid) {
      if (!validatePhone(formData.phone)) {
        setPhoneError("Please enter a valid 10-digit phone number.");
      }
      return;
    }

    setIsSubmitting(true);

    // Format plain text message
    const rawMessage = 
      `Hello! New inquiry from website:\n\n` +
      `👤 Name: ${formData.name}\n` +
      `📧 Email: ${formData.email}\n` +
      `📞 Phone: ${formData.phone}\n` +
      `📌 Subject: ${formData.subject}\n` +
      `💬 Message:\n${formData.message}`;

    // Properly encode query string parameters
    const whatsappUrl = `https://wa.me/918299431275?text=${encodeURIComponent(rawMessage)}`;

    // Trigger WhatsApp redirect
    window.open(whatsappUrl, "_blank");

    // Reset Form State
    setTimeout(() => {
      setIsSubmitting(false);
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
    }, 1000);
  };

  return (
    <div className={contactStyles.container}>
      {/* Form Container */}
      <div className={contactStyles.formContainer}>
        <form onSubmit={handleSubmit} className={contactStyles.formElements}>
          
          {/* Name */}
          <div className={contactStyles.formGroup}>
            <label className={contactStyles.label}>
              <User className={`${contactStyles.labelIcon} ${contactStyles.colors.blue.icon}`} />
              Full Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className={`${contactStyles.input} ${contactStyles.colors.blue.focus}`}
              placeholder="John Doe"
            />
          </div>

          {/* Email */}
          <div className={contactStyles.formGroup}>
            <label className={contactStyles.label}>
              <Mail className={`${contactStyles.labelIcon} ${contactStyles.colors.sky.icon}`} />
              Email Address *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className={`${contactStyles.input} ${contactStyles.colors.sky.focus}`}
              placeholder="john@example.com"
            />
          </div>

          {/* Phone */}
          <div className={contactStyles.formGroup}>
            <label className={contactStyles.label}>
              <Phone className={`${contactStyles.labelIcon} ${contactStyles.colors.green.icon}`} />
              Phone Number *
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              inputMode="numeric"
              maxLength={10}
              className={`${contactStyles.input} ${contactStyles.colors.green.focus} ${
                contactStyles.colors.green.hover
              } ${phoneError ? contactStyles.inputError : ""}`}
              placeholder="Enter 10 digit number"
            />
            {phoneError && (
              <p className={contactStyles.errorText}>{phoneError}</p>
            )}
          </div>

          {/* Subject */}
          <div className={contactStyles.formGroup}>
            <label className={contactStyles.label}>
              <MessageSquare className={`${contactStyles.labelIcon} ${contactStyles.colors.purple.icon}`} />
              Subject *
            </label>
            <select
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              required
              className={`${contactStyles.select} ${contactStyles.colors.purple.focus}`}
            >
              <option value="">Select a subject</option>
              <option value="General Inquiry">General Inquiry</option>
              <option value="Project Collaboration">Project Collaboration</option>
              <option value="Support">Support</option>
              <option value="Feedback">Feedback</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Message */}
          <div className={contactStyles.formGroup}>
            <label className={contactStyles.label}>
              <FileText className={`${contactStyles.labelIcon} ${contactStyles.colors.amber.icon}`} />
              Your Message *
            </label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              rows={4}
              className={`${contactStyles.textarea} ${contactStyles.colors.amber.focus}`}
              placeholder="How can we help you?"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!isFormValid || isSubmitting}
            className={contactStyles.submitBtn}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Redirecting...</span>
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                <span>Send via WhatsApp</span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* Animation Section */}
      <div className={contactStyles.animationContainer}>
        <div className={contactStyles.animationWrapper}>
          <DotLottieReact
            src="https://lottie.host/9ccf026c-11e9-417a-9a9d-0169bc83e49d/sMK5FavyPC.lottie"
            loop
            autoplay
            style={{
              width: "100%",
              height: "500px",
              filter: "drop-shadow(0 20px 40px rgba(0,0,0,0.1))",
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default ContactForm;
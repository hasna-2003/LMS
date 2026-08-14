import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  PlusCircle,
  Upload,
  DollarSign,
  BookOpen,
  User,
  Tag,
  Layers,
  FileText,
  Loader2,
  Image as ImageIcon,
} from "lucide-react";

const API_BASE = "http://localhost:4000";

const AddPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    teacher: "",
    category: "",
    level: "Beginner",
    pricingType: "paid",
    originalPrice: "",
    salePrice: "",
    description: "",
    thumbnail: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, thumbnail: file }));
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Send data to backend API
      const payload = new FormData();
      const originalPriceValue =
        formData.pricingType === "free" ? 0 : Number(formData.originalPrice || 0);
      const salePriceValue =
        formData.pricingType === "free" ? 0 : Number(formData.salePrice || 0);

      payload.append("name", formData.title);
      payload.append("title", formData.title);
      payload.append("teacher", formData.teacher);
      payload.append("category", formData.category);
      payload.append("level", formData.level);
      payload.append("pricingType", formData.pricingType);
      payload.append("originalPrice", String(originalPriceValue));
      payload.append("salePrice", String(salePriceValue));
      payload.append("price", JSON.stringify({ original: originalPriceValue, sale: salePriceValue }));
      payload.append("description", formData.description);
      payload.append("overview", formData.description);

      if (formData.thumbnail) {
        payload.append("thumbnail", formData.thumbnail);
      }

      const response = await fetch(`${API_BASE}/api/course/add`, {
        method: "POST",
        body: payload,
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast.success("Course added successfully!");
        navigate("/listcourse");
      } else {
        toast.error(data.message || "Failed to add course.");
      }
    } catch (error) {
      console.error("Error creating course:", error);
      toast.error("Unable to connect to the backend server. Please check that the API is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
      <div className="w-full space-y-5">
        
        {/* Page Header */}
        <div className="border-b border-slate-800 pb-5">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white flex items-center gap-2">
            <PlusCircle className="h-7 w-7 text-indigo-500" /> Add New Course
          </h1>
          <p className="text-slate-400 text-base mt-1">
            Fill out the details below to create and publish a new course to the platform.
          </p>
        </div>

        {/* Course Form Card */}
        <form onSubmit={handleSubmit} className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-6 shadow-xl space-y-6">
          
          {/* Section 1: Basic Information */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2 border-b border-slate-700/50 pb-2">
              <BookOpen className="h-5 w-5 text-indigo-400" /> Basic Details
            </h2>

            <div>
              <label className="block text-sm sm:text-base font-medium text-slate-300 mb-1">
                Course Title <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. Complete React & Tailwind CSS Masterclass"
                required
                className="w-full px-3.5 py-2.5 bg-slate-900/80 border border-slate-700 rounded-xl text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm sm:text-base font-medium text-slate-300 mb-1 flex items-center gap-1.5">
                  <User className="h-4 w-4 text-slate-400" /> Instructor / Teacher <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  name="teacher"
                  value={formData.teacher}
                  onChange={handleChange}
                  placeholder="e.g. John Doe"
                  required
                  className="w-full px-3.5 py-2.5 bg-slate-900/80 border border-slate-700 rounded-xl text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
                />
              </div>

              <div>
                <label className="block text-sm sm:text-base font-medium text-slate-300 mb-1 flex items-center gap-1.5">
                  <Tag className="h-4 w-4 text-slate-400" /> Category <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  placeholder="e.g. Development, Design, Marketing"
                  required
                  className="w-full px-3.5 py-2.5 bg-slate-900/80 border border-slate-700 rounded-xl text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm sm:text-base font-medium text-slate-300 mb-1 flex items-center gap-1.5">
                <Layers className="h-4 w-4 text-slate-400" /> Difficulty Level
              </label>
              <select
                name="level"
                value={formData.level}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-slate-900/80 border border-slate-700 rounded-xl text-xs sm:text-sm text-slate-200 focus:outline-none focus:border-indigo-500 transition"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>
          </div>

          {/* Section 2: Pricing Structure */}
          <div className="space-y-4 pt-2">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2 border-b border-slate-700/50 pb-2">
              <DollarSign className="h-5 w-5 text-emerald-400" /> Pricing Options
            </h2>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-slate-300 mb-1">
                Pricing Model
              </label>
              <select
                name="pricingType"
                value={formData.pricingType}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-slate-900/80 border border-slate-700 rounded-xl text-xs sm:text-sm text-slate-200 focus:outline-none focus:border-indigo-500 transition"
              >
                <option value="paid">Paid Course</option>
                <option value="free">Free Course</option>
              </select>
            </div>

            {formData.pricingType === "paid" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-fadeIn">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-slate-300 mb-1">
                    Original Price (Rs.)
                  </label>
                  <input
                    type="number"
                    name="originalPrice"
                    value={formData.originalPrice}
                    onChange={handleChange}
                    placeholder="e.g. 4999"
                    required={formData.pricingType === "paid"}
                    className="w-full px-3.5 py-2.5 bg-slate-900/80 border border-slate-700 rounded-xl text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-slate-300 mb-1">
                    Sale Price (Rs.) <span className="text-slate-500">(Optional)</span>
                  </label>
                  <input
                    type="number"
                    name="salePrice"
                    value={formData.salePrice}
                    onChange={handleChange}
                    placeholder="e.g. 2999"
                    className="w-full px-3.5 py-2.5 bg-slate-900/80 border border-slate-700 rounded-xl text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Section 3: Thumbnail & Description */}
          <div className="space-y-4 pt-2">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2 border-b border-slate-700/50 pb-2">
              <FileText className="h-5 w-5 text-amber-400" /> Media & Summary
            </h2>

            {/* Thumbnail Upload Box */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-slate-300 mb-1 flex items-center gap-1.5">
                <ImageIcon className="h-4 w-4 text-slate-400" /> Course Thumbnail
              </label>
              
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-700 border-dashed rounded-xl bg-slate-900/40 hover:bg-slate-900/60 transition">
                {imagePreview ? (
                  <div className="space-y-2 text-center">
                    <img
                      src={imagePreview}
                      alt="Thumbnail Preview"
                      className="mx-auto h-32 w-auto object-cover rounded-lg border border-slate-700 shadow-md"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setImagePreview(null);
                        setFormData((prev) => ({ ...prev, thumbnail: null }));
                      }}
                      className="text-xs text-rose-400 hover:text-rose-300 font-medium underline"
                    >
                      Remove & Replace Image
                    </button>
                  </div>
                ) : (
                  <div className="space-y-1 text-center">
                    <Upload className="mx-auto h-10 w-10 text-slate-500" />
                    <div className="flex text-xs text-slate-400">
                      <label className="relative cursor-pointer bg-slate-800 rounded-md font-medium text-indigo-400 hover:text-indigo-300 focus-within:outline-none px-2 py-0.5">
                        <span>Upload a file</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="sr-only"
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-[11px] text-slate-500">PNG, JPG, WEBP up to 5MB</p>
                  </div>
                )}
              </div>
            </div>

            {/* Description Area */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-slate-300 mb-1">
                Course Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                placeholder="Write a clear breakdown of topics covered, prerequisites, and key learning outcomes..."
                className="w-full px-3.5 py-2.5 bg-slate-900/80 border border-slate-700 rounded-xl text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition resize-none"
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-700/50">
            <button
              type="button"
              onClick={() => navigate("/listcourse")}
              className="px-4 py-2.5 bg-slate-700 hover:bg-slate-600 text-slate-300 text-xs sm:text-sm font-medium rounded-xl transition"
            >
              Cancel
            </button>
            
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-600/50 text-white text-xs sm:text-sm font-medium rounded-xl transition shadow-lg shadow-indigo-600/20"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Saving Course...
                </>
              ) : (
                "Publish Course"
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default AddPage;
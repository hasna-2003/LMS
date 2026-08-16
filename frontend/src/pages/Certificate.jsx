import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Award, Download, Share2 } from "lucide-react";

const CertificatePage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-100 py-12 px-4 sm:px-6 flex flex-col items-center">
      {/* Navigation Header */}
      <div className="w-full max-w-4xl flex items-center justify-between mb-8">
        <button
          onClick={() => navigate("/my-courses")}
          className="flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-all"
        >
          <ArrowLeft className="w-4 h-4" /> Back to My Courses
        </button>

        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs rounded-xl shadow-sm transition-all">
            <Download className="w-4 h-4" /> Download PDF
          </button>
        </div>
      </div>

      {/* Certificate Frame */}
      <div className="w-full max-w-4xl bg-white border-8 border-slate-900 p-12 rounded-2xl shadow-2xl relative text-center">
        <div className="border-2 border-amber-500/40 p-8 rounded-xl">
          <Award className="w-16 h-16 text-amber-500 mx-auto mb-4" />
          
          <span className="text-xs font-bold uppercase tracking-widest text-indigo-600">
            Certificate of Completion
          </span>

          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-slate-900 mt-4 mb-2">
            This is proudly presented to
          </h1>

          <p className="text-2xl font-semibold text-indigo-900 underline underline-offset-8 decoration-amber-500 my-6">
            Student Name
          </p>

          <p className="text-sm text-slate-600 max-w-lg mx-auto">
            for successfully completing all requirements and coursework for
          </p>

          <h2 className="text-xl font-bold text-slate-900 mt-2 mb-8">
            Course Ref: #{courseId}
          </h2>

          <div className="flex justify-between items-end border-t border-slate-200 pt-6 mt-12 text-xs text-slate-500">
            <div>
              <p className="font-semibold text-slate-800">Date Issued</p>
              <p>{new Date().toLocaleDateString()}</p>
            </div>
            <div>
              <p className="font-semibold text-slate-800">Verified ID</p>
              <p>CERT-{courseId}-2026</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CertificatePage;
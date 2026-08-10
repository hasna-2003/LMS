import React from "react";
import Layout from "../components/Layout";

const Contact = () => {
  return (
    <Layout>
      <div className="min-h-screen bg-slate-50 px-6 py-16">
        <div className="mx-auto max-w-4xl rounded-3xl bg-white p-8 shadow-sm">
          <h1 className="text-3xl font-semibold">Contact Us</h1>
          <p className="mt-4 text-slate-600">
            Have a question about a course or want to collaborate? Reach out and we’ll get back to you soon.
          </p>
          <div className="mt-8 space-y-3 text-slate-700">
            <p><strong>Email:</strong> hello@learnhub.com</p>
            <p><strong>Phone:</strong> +91 82994 31275</p>
            <p><strong>Location:</strong> Bengaluru, India</p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Contact;

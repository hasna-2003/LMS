import React from "react";
import Layout from "../components/Layout";

const About = () => {
  return (
    <Layout>
      <div className="min-h-screen bg-slate-50 px-6 py-16">
        <div className="mx-auto max-w-5xl rounded-3xl bg-white p-8 shadow-sm">
          <h1 className="text-3xl font-semibold">About LearnHub</h1>
          <p className="mt-4 text-slate-600">
            LearnHub helps students grow through practical, high-quality courses designed to be clear, flexible, and career focused.
          </p>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {[
              { title: "Practical learning", text: "Real-world skills developers can apply quickly." },
              { title: "Flexible access", text: "Learn at your own pace from anywhere." },
              { title: "Supportive community", text: "Get guidance from instructors and peers." },
            ].map((item) => (
              <div key={item.title} className="rounded-2xl border border-slate-200 p-5">
                <h2 className="font-semibold text-slate-800">{item.title}</h2>
                <p className="mt-2 text-sm text-slate-600">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default About;

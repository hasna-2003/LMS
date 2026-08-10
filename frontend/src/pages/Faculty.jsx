import React from "react";
import Layout from "../components/Layout";

const Faculty = () => {
  return (
    <Layout>
      <div className="min-h-screen bg-slate-50 px-6 py-16">
        <div className="mx-auto max-w-5xl">
          <h1 className="text-3xl font-semibold">Meet the Faculty</h1>
          <p className="mt-3 text-slate-600">Our mentors bring real-world expertise and a passion for teaching.</p>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {[
              { name: "Sophia Miller", role: "React Specialist" },
              { name: "John Smith", role: "Web Development Mentor" },
              { name: "Sarah Johnson", role: "JavaScript Expert" },
            ].map((person) => (
              <div key={person.name} className="rounded-3xl bg-white p-6 shadow-sm">
                <h2 className="font-semibold text-slate-800">{person.name}</h2>
                <p className="mt-2 text-sm text-slate-600">{person.role}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Faculty;

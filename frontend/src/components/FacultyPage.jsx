import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Star,
  BookOpen,
  Users,
  Search,
  X,
  Mail,
  Globe,
  Twitter,
  Award,
} from "lucide-react";

// Mock Data for Faculty Members
const initialTeachers = [
  {
    id: 1,
    name: "Dr. Sarah Jenkins",
    role: "Lead Full-Stack Instructor",
    department: "Computer Science",
    image:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300",
    initialRating: 4.9,
    studentsCount: 3420,
    coursesCount: 8,
    bio: "Ph.D. in Computer Science with 10+ years of experience building modern scalable web applications and mentoring junior engineers.",
    skills: ["React", "Node.js", "PostgreSQL", "System Architecture"],
  },
  {
    id: 2,
    name: "Prof. Marcus Vance",
    role: "Senior UI/UX & Product Design Lead",
    department: "Design",
    image:
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=300",
    initialRating: 4.8,
    studentsCount: 2890,
    coursesCount: 5,
    bio: "Ex-Design Director passionate about user-centric design systems, accessibility standards, and interactive prototyping.",
    skills: ["Figma", "Design Systems", "User Research", "Prototyping"],
  },
  {
    id: 3,
    name: "Elena Rostova",
    role: "Data Science & AI Specialist",
    department: "Data Science",
    image:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=300",
    initialRating: 4.7,
    studentsCount: 4100,
    coursesCount: 12,
    bio: "Data Scientist focusing on practical machine learning pipelines, NLP applications, and big data visualization techniques.",
    skills: ["Python", "TensorFlow", "Pandas", "SQL"],
  },
  {
    id: 4,
    name: "David Kim",
    role: "DevOps & Cloud Architect",
    department: "Computer Science",
    image:
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=300",
    initialRating: 4.9,
    studentsCount: 1950,
    coursesCount: 6,
    bio: "Cloud infrastructure practitioner specialized in Kubernetes orchestration, CI/CD automation, and cloud security frameworks.",
    skills: ["AWS", "Docker", "Kubernetes", "CI/CD"],
  },
];

// Tailored Style Object (Fallback to utility Tailwind classes)
const facultyStyles = {
  container: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16",
  headerSection: "text-center max-w-3xl mx-auto mb-12",
  badge:
    "inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-sm font-medium mb-3",
  title: "text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight",
  subtitle: "mt-3 text-lg text-slate-600",
  filterBar: "flex flex-col sm:flex-row gap-4 items-center justify-between mb-10",
  searchWrapper: "relative w-full sm:w-80",
  searchInput:
    "w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm transition-all",
  searchIcon: "absolute left-3 top-3 w-4 h-4 text-slate-400",
  tabContainer: "flex gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0",
  tabBtn:
    "px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap",
  activeTab: "bg-indigo-600 text-white shadow-sm",
  inactiveTab: "bg-slate-100 text-slate-600 hover:bg-slate-200",
  grid: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8",
  card: "group bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden",
  cardImageWrapper: "relative h-56 w-full overflow-hidden bg-slate-100",
  cardImage:
    "w-full h-full object-cover group-hover:scale-105 transition-transform duration-500",
  cardContent: "p-6 flex-1 flex flex-col justify-between",
  teacherName: "text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors",
  teacherRole: "text-xs font-semibold text-indigo-600 mb-2 uppercase tracking-wider",
  departmentTag: "text-xs bg-slate-100 text-slate-600 px-2.5 py-0.5 rounded-md self-start mb-3",
  ratingContainer: "flex items-center gap-1 my-3",
  starIcon: "w-4 h-4 cursor-pointer transition-colors duration-150",
  starButtonActive: "text-amber-400 fill-amber-400",
  starButtonInactive: "text-slate-200 fill-slate-200 hover:text-amber-300",
  statsGrid: "grid grid-cols-2 gap-2 py-3 my-3 border-y border-slate-100 text-xs text-slate-500",
  statItem: "flex items-center gap-1.5",
  profileBtn:
    "mt-4 w-full py-2.5 rounded-xl border border-indigo-200 bg-indigo-50/50 text-indigo-700 text-sm font-semibold hover:bg-indigo-600 hover:text-white transition-all duration-200 text-center cursor-pointer",
};

const FacultyPage = () => {
  const [teachers, setTeachers] = useState(initialTeachers);
  const [ratings, setRatings] = useState({});
  const [selectedDepartment, setSelectedDepartment] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTeacherModal, setActiveTeacherModal] = useState(null);

  // Departments List
  const departments = ["All", "Computer Science", "Design", "Data Science"];

  // Interactive Rating Handler
  const handleRate = (teacherId, starIndex) => {
    setRatings((prev) => ({
      ...prev,
      [teacherId]: starIndex + 1,
    }));
  };

  // Filter Logic
  const filteredTeachers = teachers.filter((t) => {
    const matchesDept =
      selectedDepartment === "All" || t.department === selectedDepartment;
    const matchesSearch =
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.role.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDept && matchesSearch;
  });

  return (
    <div className={facultyStyles.container}>
      {/* Header */}
      <div className={facultyStyles.headerSection}>
        <div className={facultyStyles.badge}>
          <Award className="w-4 h-4" />
          <span>World-Class Mentors</span>
        </div>
        <h1 className={facultyStyles.title}>Meet Our Expert Faculty</h1>
        <p className={facultyStyles.subtitle}>
          Learn directly from industry leaders, experienced researchers, and senior engineers committed to your success.
        </p>
      </div>

      {/* Filter & Search Toolbar */}
      <div className={facultyStyles.filterBar}>
        <div className={facultyStyles.searchWrapper}>
          <Search className={facultyStyles.searchIcon} />
          <input
            type="text"
            placeholder="Search by instructor name or title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={facultyStyles.searchInput}
          />
        </div>

        <div className={facultyStyles.tabContainer}>
          {departments.map((dept) => (
            <button
              key={dept}
              onClick={() => setSelectedDepartment(dept)}
              className={`${facultyStyles.tabBtn} ${
                selectedDepartment === dept
                  ? facultyStyles.activeTab
                  : facultyStyles.inactiveTab
              }`}
            >
              {dept}
            </button>
          ))}
        </div>
      </div>

      {/* Faculty Card Grid */}
      <motion.div layout className={facultyStyles.grid}>
        <AnimatePresence>
          {filteredTeachers.map((teacher, index) => {
            const currentRating =
              ratings[teacher.id] || Math.round(teacher.initialRating);

            return (
              <motion.div
                key={teacher.id}
                layout
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.06, duration: 0.3 }}
                className={facultyStyles.card}
              >
                {/* Photo */}
                <div className={facultyStyles.cardImageWrapper}>
                  <img
                    src={teacher.image}
                    alt={teacher.name}
                    className={facultyStyles.cardImage}
                  />
                </div>

                {/* Info Container */}
                <div className={facultyStyles.cardContent}>
                  <div>
                    <span className={facultyStyles.departmentTag}>
                      {teacher.department}
                    </span>
                    <h3 className={facultyStyles.teacherName}>{teacher.name}</h3>
                    <p className={facultyStyles.teacherRole}>{teacher.role}</p>

                    {/* Dynamic Rating Bar */}
                    <div className={facultyStyles.ratingContainer}>
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          onClick={() => handleRate(teacher.id, i)}
                          className={`${facultyStyles.starIcon} ${
                            i < currentRating
                              ? facultyStyles.starButtonActive
                              : facultyStyles.starButtonInactive
                          }`}
                        />
                      ))}
                      <span className="text-xs font-semibold text-slate-700 ml-1.5">
                        {ratings[teacher.id] ? `${ratings[teacher.id]}.0` : teacher.initialRating}
                      </span>
                    </div>

                    {/* Stats */}
                    <div className={facultyStyles.statsGrid}>
                      <div className={facultyStyles.statItem}>
                        <Users className="w-3.5 h-3.5 text-slate-400" />
                        <span>{teacher.studentsCount.toLocaleString()} Students</span>
                      </div>
                      <div className={facultyStyles.statItem}>
                        <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                        <span>{teacher.coursesCount} Courses</span>
                      </div>
                    </div>
                  </div>

                  {/* Profile Action */}
                  <button
                    onClick={() => setActiveTeacherModal(teacher)}
                    className={facultyStyles.profileBtn}
                  >
                    View Profile
                  </button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>

      {/* Empty State */}
      {filteredTeachers.length === 0 && (
        <div className="text-center py-16 bg-slate-50 rounded-2xl mt-6 border border-dashed border-slate-200">
          <p className="text-slate-500 font-medium">No faculty members found matching your criteria.</p>
          <button
            onClick={() => {
              setSelectedDepartment("All");
              setSearchQuery("");
            }}
            className="mt-3 text-sm font-semibold text-indigo-600 underline"
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* Teacher Profile Modal */}
      <AnimatePresence>
        {activeTeacherModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl relative"
            >
              <button
                onClick={() => setActiveTeacherModal(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="p-6">
                <div className="flex gap-4 items-center">
                  <img
                    src={activeTeacherModal.image}
                    alt={activeTeacherModal.name}
                    className="w-20 h-20 rounded-2xl object-cover"
                  />
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">
                      {activeTeacherModal.name}
                    </h3>
                    <p className="text-sm text-indigo-600 font-medium">
                      {activeTeacherModal.role}
                    </p>
                    <span className="inline-block mt-1 text-xs bg-slate-100 px-2 py-0.5 rounded text-slate-600">
                      {activeTeacherModal.department}
                    </span>
                  </div>
                </div>

                <p className="mt-4 text-sm text-slate-600 leading-relaxed">
                  {activeTeacherModal.bio}
                </p>

                <div className="mt-4">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Areas of Expertise
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {activeTeacherModal.skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-2.5 py-1 bg-slate-100 text-slate-700 text-xs rounded-lg font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex gap-3 text-slate-400">
                    <Mail className="w-5 h-5 hover:text-indigo-600 cursor-pointer transition-colors" />
                    <Globe className="w-5 h-5 hover:text-indigo-600 cursor-pointer transition-colors" />
                    <Twitter className="w-5 h-5 hover:text-indigo-600 cursor-pointer transition-colors" />
                  </div>
                  <button
                    onClick={() => setActiveTeacherModal(null)}
                    className="px-5 py-2 bg-indigo-600 text-white font-medium text-sm rounded-xl hover:bg-indigo-700 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FacultyPage;